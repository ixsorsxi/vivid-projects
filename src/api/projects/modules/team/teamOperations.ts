
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

    // Use the project access checker to verify permissions
    const accessCheck = await checkUserProjectAccess(projectId);
    debugLog('API', 'Access check result:', accessCheck);
    
    if (!accessCheck.hasAccess) {
      debugError('API', 'User does not have access to add members to this project', accessCheck);
      throw new Error(`Access denied: ${accessCheck.reason || 'Unknown reason'}`);
    }

    // Check if this user already exists in the project (if user_id is provided)
    if (member.user_id) {
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', member.user_id)
        .single();
      
      if (checkError && !checkError.message.includes('No rows found')) {
        debugError('API', 'Error checking existing member:', checkError);
        throw new Error(checkError.message);
      }
      
      if (existingMember) {
        debugLog('API', 'User is already a member of this project:', existingMember);
        throw new Error('This user is already a member of this project');
      }
    } else if (member.email) {
      // Check if an external member with this email already exists
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('project_member_name', member.email.split('@')[0])
        .is('user_id', null)
        .single();
        
      if (emailCheckError && !emailCheckError.message.includes('No rows found')) {
        debugError('API', 'Error checking existing email:', emailCheckError);
        throw new Error(emailCheckError.message);
      }
      
      if (existingEmail) {
        debugLog('API', 'Email is already invited to this project:', existingEmail);
        throw new Error('This email is already invited to this project');
      }
    }

    // Format data for insert - direct database access approach
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'Team Member'
    };
    
    debugLog('API', 'Inserting member with data:', memberData);
    
    // Perform the direct insert
    const { error: insertError } = await supabase
      .from('project_members')
      .insert(memberData);
    
    if (insertError) {
      debugError('API', 'Error adding team member:', insertError);
      throw new Error(insertError.message);
    }
    
    debugLog('API', 'Successfully added team member:', member.name);
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
    
    // Use the access checker to verify permissions
    const accessCheck = await checkUserProjectAccess(projectId);
    debugLog('API', 'Access check result for removal:', accessCheck);
    
    if (!accessCheck.hasAccess) {
      debugError('API', 'User does not have access to remove members from this project', accessCheck);
      return false;
    }
    
    // Direct DELETE operation 
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
