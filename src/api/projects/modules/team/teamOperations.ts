
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../utils';
import { checkProjectMemberAccess } from './check_project_member_access';
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

    // Ensure role is formatted as a project role, not a system role
    // Project roles are specific to projects and independent of system roles
    let projectRole = member.role;
    if (!projectRole || projectRole === '') {
      projectRole = 'Team Member'; // Default project role
      debugLog('API', 'Using default project role: Team Member');
    }

    // Format data for direct insert
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: projectRole
    };
    
    debugLog('API', 'Member data to insert:', memberData);

    // Try using the check_project_member_access function first
    const { data: hasAccess, error: accessError } = await supabase
      .rpc('check_project_member_access', { p_project_id: projectId });

    if (accessError) {
      debugError('API', 'Error checking project member access:', accessError);
      // Continue anyway as we'll try direct insertion
    } else if (!hasAccess) {
      debugError('API', 'User does not have access to add members to this project');
      return false;
    }
    
    // Try direct insert as primary method
    const { data: insertData, error: insertError } = await supabase
      .from('project_members')
      .insert(memberData)
      .select();
    
    if (insertError) {
      debugError('API', 'Error in direct insert:', insertError);
      
      // Try again with more detailed error logging
      if (insertError.code === '42501') {
        debugError('API', 'Permission denied error. Likely an RLS policy issue.');
        debugLog('API', 'Attempting to identify which policy is failing...');
        
        // Try a different approach to diagnose permission issues
        const { data: projectOwner } = await supabase
          .rpc('is_project_owner', { p_project_id: projectId });
        
        debugLog('API', 'Is user project owner?', projectOwner);
        
        if (projectOwner) {
          debugLog('API', 'User is project owner, should have permission. RLS policy may be incorrect.');
        }
      } else if (insertError.code === '23505') {
        debugError('API', 'Duplicate key error. This member might already be in the project.');
      }
      
      throw insertError;
    }
    
    debugLog('API', 'Successfully added team member via direct insert, result:', insertData);
    return true;
  } catch (error) {
    debugError('API', 'Exception in addProjectTeamMember:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error(`Team member addition failed: ${error.message}`);
      
      if ('code' in error && typeof error.code === 'string') {
        // Handle specific Supabase/Postgres error codes
        const errorCode = error.code;
        if (errorCode === '23505') {
          console.error('Duplicate team member: This user is already a member of this project');
        } else if (errorCode === '23503') {
          console.error('Foreign key violation: Invalid project ID or user ID');
        } else if (errorCode === '42501') {
          console.error('Permission denied: RLS policy is preventing this operation');
        }
      }
    }
    
    throw error; // Re-throw so the UI can handle it
  }
};

/**
 * Explicitly named wrapper function for adding a team member to a project
 * This provides a clearer API for adding team members
 */
export const addTeamMemberToProject = async (
  projectId: string,
  userId: string | undefined,
  name: string,
  role: string = 'Team Member', // Default project role
  email?: string
): Promise<boolean> => {
  debugLog('API', 'addTeamMemberToProject called with:', { projectId, userId, name, role, email });
  
  // Ensure we're using a project role, not a system role
  // Project roles are specific to the project and should be one of:
  // "Project Manager", "Team Member", "Developer", etc.
  const projectRole = role || 'Team Member';
  
  try {
    return await addProjectTeamMember(projectId, {
      user_id: userId,
      name: name,
      role: projectRole,
      email: email
    });
  } catch (error) {
    debugError('API', 'Error in addTeamMemberToProject:', error);
    throw error; // Re-throw to allow UI error handling
  }
};

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    debugLog('API', 'Removing team member from project:', projectId, 'memberId:', memberId);
    
    // Check if the user has access to this project
    const { data: hasAccess, error: accessError } = await supabase
      .rpc('check_project_member_access', { p_project_id: projectId });
    
    if (accessError) {
      debugError('API', 'Error checking project member access:', accessError);
      return false;
    }
    
    if (!hasAccess) {
      debugError('API', 'User does not have access to remove members from this project');
      return false;
    }
    
    // Direct DELETE operation with new RLS policies
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      debugError('API', 'Error removing team member (direct DELETE):', formattedError);
      return false;
    }

    debugLog('API', 'Successfully removed team member via direct DELETE');
    return true;
  } catch (error) {
    debugError('API', 'Error in removeProjectTeamMember:', error);
    return false;
  }
};
