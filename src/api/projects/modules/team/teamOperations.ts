
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../utils';
import { checkProjectMemberAccess } from './check_project_member_access';

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
    
    // Get current user from auth state
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

    // Check if the user has access to add members to this project
    const hasAccess = await checkProjectMemberAccess(projectId);
    if (!hasAccess) {
      console.error('[API] User does not have access to add members to this project');
      return false;
    }

    // Ensure role is formatted as a project role, not a system role
    // Project roles are specific to projects and independent of system roles
    let projectRole = member.role;
    if (!projectRole || projectRole === '') {
      projectRole = 'Team Member'; // Default project role
    }

    // Format data for direct insert
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: projectRole
    };
    
    console.log('[API] Member data to insert:', memberData);
    
    // Try direct insert as primary method
    const { data: insertData, error: insertError } = await supabase
      .from('project_members')
      .insert(memberData)
      .select();
    
    if (insertError) {
      console.error('[API] Error in direct insert:', insertError);
      return false;
    }
    
    console.log('[API] Successfully added team member via direct insert, result:', insertData);
    return true;
  } catch (error) {
    console.error('[API] Exception in addProjectTeamMember:', error);
    return false;
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
  console.log('[API] addTeamMemberToProject called with:', { projectId, userId, name, role, email });
  
  // Ensure we're using a project role, not a system role
  // Project roles are specific to the project and should be one of:
  // "Project Manager", "Team Member", "Contributor", "Viewer", etc.
  const projectRole = role || 'Team Member';
  
  return addProjectTeamMember(projectId, {
    user_id: userId,
    name: name,
    role: projectRole,
    email: email
  });
};

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    console.log('[API] Removing team member from project:', projectId, 'memberId:', memberId);
    
    // Check if the user has access to this project
    const hasAccess = await checkProjectMemberAccess(projectId);
    if (!hasAccess) {
      console.error('[API] User does not have access to remove members from this project');
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
