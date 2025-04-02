
import { supabase } from '@/integrations/supabase/client';

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
    
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select('id, name, role')
      .single();

    if (error) {
      console.error('Error adding team member:', error);
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
      console.error('Error removing team member:', error);
      return false;
    }

    console.log('Successfully removed team member');
    return true;
  } catch (error) {
    console.error('Error in removeProjectTeamMember:', error);
    return false;
  }
};
