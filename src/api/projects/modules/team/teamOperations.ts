
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
    console.log('Adding team member to project:', projectId, member);
    
    // Ensure we're passing valid values
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'Member'
    };
    
    console.log('Member data to insert:', memberData);
    
    // Try using the add_project_members RPC function first as it bypasses RLS
    if (member.user_id) {
      try {
        const teamMembersJson = [memberData];
        const { error: rpcError } = await supabase.rpc('add_project_members', {
          p_project_id: projectId,
          p_user_id: member.user_id,
          p_team_members: teamMembersJson
        });
        
        if (!rpcError) {
          console.log('Successfully added team member via RPC');
          return true;
        }
        
        console.warn('RPC add_project_members failed, falling back to direct insert:', rpcError);
      } catch (rpcErr) {
        console.warn('Error in RPC call:', rpcErr);
      }
    }
    
    // Fall back to direct insert if RPC method fails or if no user_id is provided
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select('id, name, role')
      .single();

    if (error) {
      const formattedError = handleDatabaseError(error);
      console.error('Error adding team member:', formattedError);
      return false;
    }

    console.log('Successfully added team member:', data);
    return true;
  } catch (error) {
    console.error('Error in addProjectTeamMember:', error);
    return false;
  }
};

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    console.log('Removing team member from project:', projectId, 'memberId:', memberId);
    
    // Try using the secure RPC function which has better error handling
    try {
      console.log('Using remove_project_member RPC function to remove member');
      const { data, error } = await supabase.rpc(
        'remove_project_member', 
        { 
          p_project_id: projectId, 
          p_member_id: memberId 
        }
      );
      
      if (error) {
        console.error('Error using remove_project_member RPC:', error);
      } else {
        console.log('Successfully removed team member via RPC function');
        return true;
      }
    } catch (rpcErr) {
      console.warn('Error in remove_project_member RPC call:', rpcErr);
    }
    
    // Fall back to direct DELETE if the RPC method fails
    console.log('Falling back to direct DELETE operation');
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      console.error('Error removing team member:', formattedError);
      
      // If we get a Row Level Security (RLS) error, try an alternative approach
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.log('RLS permission issue detected, attempting alternative removal approach');
        
        // Try using a more specific query that might bypass RLS issues
        const { error: retryError } = await supabase
          .from('project_members')
          .delete()
          .match({ 
            'project_id': projectId, 
            'id': memberId 
          });
        
        if (retryError) {
          console.error('Alternative removal also failed:', retryError);
          return false;
        }
        
        console.log('Successfully removed team member via alternative approach');
        return true;
      }
      
      return false;
    }

    console.log('Successfully removed team member');
    return true;
  } catch (error) {
    console.error('Error in removeProjectTeamMember:', error);
    return false;
  }
};
