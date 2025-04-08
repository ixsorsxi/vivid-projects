
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Adds a team member to a project by directly bypassing RLS policies
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { name: string; role: string; email?: string; user_id?: string }
): Promise<boolean> => {
  try {
    debugLog('API', 'Adding team member to project:', projectId);
    debugLog('API', 'Member data:', member);
    
    // Create a safer member object with default values
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'team_member',
      joined_at: new Date().toISOString()
    };
    
    // Use direct insert with single() to get feedback
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select()
      .single();
    
    if (error) {
      // Handle specific error types
      if (error.code === '23505') { // Unique violation
        debugError('API', 'User is already a member of this project');
        throw new Error('This user is already a member of this project');
      } else if (error.code === '42501') { // Permission denied
        debugError('API', 'Permission denied when adding team member');
        throw new Error('You don\'t have permission to add members to this project');
      } else {
        debugError('API', 'Error adding team member:', error);
        throw new Error(error.message || 'Failed to add team member');
      }
    }
    
    debugLog('API', 'Successfully added team member with ID:', data?.id);
    return true;
  } catch (error) {
    debugError('API', 'Exception in addProjectTeamMember:', error);
    throw error; // Re-throw for UI handling
  }
};

/**
 * Wrapper function for adding a team member to a project
 */
export const addTeamMemberToProject = async (
  projectId: string,
  userId: string | undefined,
  name: string,
  role: string = 'team_member',
  email?: string
): Promise<boolean> => {
  debugLog('API', 'addTeamMemberToProject called with:', { projectId, userId, name, role, email });
  
  try {
    return await addProjectTeamMember(projectId, {
      user_id: userId,
      name: name,
      role: role,
      email: email
    });
  } catch (error) {
    debugError('API', 'Error in addTeamMemberToProject:', error);
    throw error;
  }
};
