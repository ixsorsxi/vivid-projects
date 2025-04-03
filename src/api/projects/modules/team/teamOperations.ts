
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../utils';

/**
 * Adds a team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { name: string; role: string; email?: string; user_id?: string }
): Promise<boolean> => {
  try {
    console.log('[API] Adding team member to project:', projectId, member);
    
    // Ensure we're passing valid values
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'Team Member'
    };
    
    console.log('[API] Member data to insert:', memberData);
    
    // Get current user id from auth state
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    console.log('[API] Current authenticated user:', currentUser?.id);
    
    if (!currentUser) {
      console.error('[API] No authenticated user found');
      return false;
    }
    
    // Try direct insert with explicit return data for better error visibility
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select('id');

    if (error) {
      console.error('[API] Error adding team member:', error);
      
      // Try fallback to security definer function
      try {
        console.log('[API] Attempting add_project_members security definer function');
        
        // Format data for the function
        const membersArray = [{
          name: memberData.project_member_name,
          role: memberData.role,
          user_id: memberData.user_id
        }];
        
        const { data: rpcData, error: rpcError } = await supabase.rpc('add_project_members', {
          p_project_id: projectId,
          p_user_id: currentUser.id,
          p_team_members: membersArray // Remove JSON.stringify - we were double-stringifying
        });
        
        if (rpcError) {
          console.error('[API] Security definer function also failed:', rpcError);
          return false;
        }
        
        console.log('[API] Successfully added team member via security definer function, result:', rpcData);
        return true;
      } catch (rpcErr) {
        console.error('[API] Exception in security definer function:', rpcErr);
        return false;
      }
    }

    console.log('[API] Successfully added team member via direct insert:', data);
    return true;
  } catch (error) {
    console.error('[API] Exception in addProjectTeamMember:', error);
    return false;
  }
};

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    console.log('[API] Removing team member from project:', projectId, 'memberId:', memberId);
    
    // Get current user for context
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    if (!currentUser) {
      console.error('[API] No authenticated user found');
      return false;
    }
    
    // First attempt: Try the secure RPC function 
    try {
      console.log('[API] Using remove_project_member security definer function');
      const { data, error } = await supabase.rpc(
        'remove_project_member', 
        { 
          p_project_id: projectId, 
          p_member_id: memberId 
        }
      );
      
      if (error) {
        console.error('[API] Error using remove_project_member function:', error);
      } else {
        console.log('[API] Successfully removed team member via security definer function');
        return true;
      }
    } catch (rpcErr) {
      console.warn('[API] Error in remove_project_member function call:', rpcErr);
    }
    
    // Second attempt: Direct DELETE operation
    console.log('[API] Falling back to direct DELETE operation');
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      console.error('[API] Error removing team member (direct DELETE):', formattedError);
      
      // Third attempt: Try an alternative approach for RLS issues
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.log('[API] RLS permission issue detected, attempting alternative approach');
        
        try {
          // Try alternative method with match syntax
          const { error: matchError } = await supabase
            .from('project_members')
            .delete()
            .match({ 
              'project_id': projectId, 
              'id': memberId 
            });
          
          if (matchError) {
            console.error('[API] Alternative removal (match) also failed:', matchError);
            return false;
          }
          
          console.log('[API] Successfully removed team member via match method');
          return true;
        } catch (alternativeErr) {
          console.error('[API] Error in alternative removal approach:', alternativeErr);
          return false;
        }
      }
      
      return false;
    }

    console.log('[API] Successfully removed team member via direct DELETE');
    return true;
  } catch (error) {
    console.error('[API] Error in removeProjectTeamMember:', error);
    return false;
  }
};
