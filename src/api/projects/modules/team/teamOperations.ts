
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
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('[API] Authentication error:', authError);
      return false;
    }
    
    const currentUser = authData?.user;
    
    console.log('[API] Current authenticated user:', currentUser?.id);
    
    if (!currentUser) {
      console.error('[API] No authenticated user found');
      return false;
    }
    
    // Try direct insert first (with RLS this will work for project owners and admins)
    try {
      const { error } = await supabase
        .from('project_members')
        .insert(memberData);
      
      if (error) {
        console.error('[API] Error in direct insert:', error);
        
        // Check if the error is a foreign key or unique constraint violation
        if (error.code === '23503' || error.code === '23505') {
          console.error('[API] Constraint violation:', error.message);
          return false;
        }
        
        // Fall through to RPC method for other errors
      } else {
        console.log('[API] Successfully added team member via direct insert');
        return true;
      }
    } catch (insertError) {
      console.error('[API] Exception in direct insert:', insertError);
      // Fall through to RPC method
    }
    
    // If direct insert failed, try using the add_project_members security definer function
    try {
      console.log('[API] Attempting add_project_members security definer function');
      
      // Format data for the function call
      const membersArray = [{
        name: memberData.project_member_name,
        role: memberData.role,
        user_id: memberData.user_id
      }];
      
      // Try the RPC function with JSON string
      const { error: rpcError } = await supabase.rpc('add_project_members', {
        p_project_id: projectId,
        p_user_id: currentUser.id,
        p_team_members: JSON.stringify(membersArray)  // Convert to JSON string for the function
      });
      
      if (rpcError) {
        console.error('[API] Security definer function failed with JSON string:', rpcError);
        
        // Try alternative approach with direct array if the JSON string approach fails
        const { error: alternativeRpcError } = await supabase.rpc('add_project_members', {
          p_project_id: projectId,
          p_user_id: currentUser.id,
          p_team_members: membersArray  // Try passing the array directly
        });
        
        if (alternativeRpcError) {
          console.error('[API] Alternative approach also failed:', alternativeRpcError);
          return false;
        }
        
        console.log('[API] Successfully added team member via alternative RPC approach');
        return true;
      }
      
      console.log('[API] Successfully added team member via security definer function');
      return true;
    } catch (rpcErr) {
      console.error('[API] Exception in security definer function:', rpcErr);
      return false;
    }
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
      const { error } = await supabase.rpc(
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
