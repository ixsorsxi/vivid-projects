
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
      name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
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
    
    // Direct insert approach - simplest and most reliable
    console.log('[API] Attempting direct insert with data:', memberData);
    
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select('id, name, role')
      .single();

    if (error) {
      const formattedError = handleDatabaseError(error);
      console.error('[API] Error adding team member:', formattedError);
      console.error('[API] Raw error:', error);
      
      // Fallback to RPC function if direct insert fails due to RLS
      if (error.code === '42501' || error.message?.includes('permission')) {
        console.log('[API] Attempting add_project_members RPC function');
        
        try {
          // Convert member to JSON array format expected by RPC function
          const teamMembersJson = [memberData];
          
          const { error: rpcError } = await supabase.rpc('add_project_members', {
            p_project_id: projectId,
            p_user_id: currentUser.id,
            p_team_members: JSON.stringify(teamMembersJson)
          });
          
          if (rpcError) {
            console.error('[API] RPC fallback also failed:', rpcError);
            return false;
          }
          
          console.log('[API] Successfully added team member via RPC function');
          return true;
        } catch (rpcErr) {
          console.error('[API] Error in RPC fallback:', rpcErr);
          return false;
        }
      }
      
      return false;
    }

    console.log('[API] Successfully added team member via direct insert:', data);
    return true;
  } catch (error) {
    console.error('[API] Error in addProjectTeamMember:', error);
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
      console.log('[API] Using remove_project_member RPC function');
      const { data, error } = await supabase.rpc(
        'remove_project_member', 
        { 
          p_project_id: projectId, 
          p_member_id: memberId 
        }
      );
      
      if (error) {
        console.error('[API] Error using remove_project_member RPC:', error);
      } else {
        console.log('[API] Successfully removed team member via RPC function');
        return true;
      }
    } catch (rpcErr) {
      console.warn('[API] Error in remove_project_member RPC call:', rpcErr);
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
