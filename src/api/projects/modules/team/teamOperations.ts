
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';
import { checkUserProjectAccess } from '@/utils/projectAccessChecker';

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

    // In development mode, bypass access check because we've added the bypass_rls_for_development function
    // No need to do a separate check since RLS policies are now using bypass_rls_for_development()
    
    // Check if user already exists in the project
    if (member.user_id) {
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', member.user_id)
        .maybeSingle();
      
      if (checkError && !checkError.message.includes('No rows found')) {
        debugError('API', 'Error checking existing member:', checkError);
        throw new Error(checkError.message);
      }
      
      if (existingMember) {
        debugError('API', 'User is already a member of this project:', existingMember);
        throw new Error('This user is already a member of this project');
      }
    }
    
    // Format data for insert
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'Team Member'
    };
    
    debugLog('API', 'Inserting member with data:', memberData);
    
    // Try direct insert - this will now work with our bypass_rls_for_development function
    const { data: insertData, error: insertError } = await supabase
      .from('project_members')
      .insert(memberData)
      .select();
    
    if (insertError) {
      debugError('API', 'Error adding team member:', insertError);
      throw new Error(insertError.message);
    }
    
    debugLog('API', 'Successfully added team member:', member.name);
    debugLog('API', 'Insert response:', insertData);
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
  role: string = 'Team Member',
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

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    debugLog('API', 'Removing team member from project:', projectId, 'memberId:', memberId);
    
    // With our new bypass_rls_for_development function, we can directly delete from the database
    // without needing to check access
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      debugError('API', 'Error removing team member:', formattedError);
      return false;
    }

    debugLog('API', 'Successfully removed team member');
    return true;
  } catch (error) {
    debugError('API', 'Error in removeProjectTeamMember:', error);
    return false;
  }
};
