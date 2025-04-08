
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Adds a team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { name: string; role: string; email?: string; user_id?: string }
): Promise<boolean> => {
  try {
    debugLog('API', 'Adding team member to project:', projectId);
    debugLog('API', 'Member data:', member);
    
    // Get current user from auth state
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      debugError('API', 'Authentication error:', authError);
      return false;
    }
    
    const currentUser = authData?.user;
    debugLog('API', 'Current authenticated user:', currentUser?.id);
    
    if (!currentUser) {
      debugError('API', 'No authenticated user found');
      return false;
    }

    // Use the new database function to add the team member
    // This bypasses RLS policies and prevents infinite recursion
    // We need to cast to 'any' to bypass the TypeScript type checking for RPC functions
    // since our custom function isn't in the generated types
    const { data, error } = await (supabase.rpc as any)(
      'add_project_member',
      {
        p_project_id: projectId,
        p_user_id: member.user_id || null,
        p_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
        p_role: member.role || 'team_member',
        p_email: member.email || null
      }
    );
    
    if (error) {
      debugError('API', 'Error calling add_project_member function:', error);
      throw new Error(error.message);
    }
    
    debugLog('API', 'Successfully added team member with ID:', data);
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
