
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
    
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      console.error('Error removing team member:', formattedError);
      return false;
    }

    console.log('Successfully removed team member');
    return true;
  } catch (error) {
    console.error('Error in removeProjectTeamMember:', error);
    return false;
  }
};
