
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
    console.log('Removing team member from project:', projectId, memberId);
    
    // Try using an RPC function first (if available) to bypass RLS
    try {
      // Check if we can directly call an RPC to remove project members
      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser && currentUser.user) {
        // This is a placeholder for if you have or want to create an RPC function
        // Similar to add_project_members but for removing members
        // For now, we'll just log the user ID for debugging
        console.log('Current authenticated user ID:', currentUser.user.id);
      }
    } catch (err) {
      console.warn('Error getting current user:', err);
    }
    
    // Attempt the direct delete operation
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
