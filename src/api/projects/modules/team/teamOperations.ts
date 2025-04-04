
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
    console.log('[API] Adding team member to project:', projectId);
    console.log('[API] Member data:', member);
    
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

    // Directly use the RPC function as the primary method
    try {
      console.log('[API] Using add_project_members RPC function');
      
      // Format data for the function call
      const membersArray = [{
        name: memberData.project_member_name,
        role: memberData.role,
        user_id: memberData.user_id
      }];
      
      // Call the RPC function
      const { error: rpcError } = await supabase.rpc('add_project_members', {
        p_project_id: projectId,
        p_user_id: currentUser.id,
        p_team_members: JSON.stringify(membersArray)
      });
      
      if (rpcError) {
        console.error('[API] Error in add_project_members function:', rpcError);
        // Fall back to direct insert if RPC fails
      } else {
        console.log('[API] Successfully added team member via RPC function');
        return true;
      }
    } catch (rpcError) {
      console.error('[API] Error in RPC call:', rpcError);
      // Fall back to direct insert
    }
    
    // Try direct insert as fallback
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
        
        return false;
      } else {
        console.log('[API] Successfully added team member via direct insert');
        return true;
      }
    } catch (insertError) {
      console.error('[API] Exception in direct insert:', insertError);
      return false;
    }
    
    return false;
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
      return false;
    }

    console.log('[API] Successfully removed team member via direct DELETE');
    return true;
  } catch (error) {
    console.error('[API] Error in removeProjectTeamMember:', error);
    return false;
  }
};
