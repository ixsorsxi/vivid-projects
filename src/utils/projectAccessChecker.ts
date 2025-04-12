
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Interface for project access check results
 */
interface ProjectAccessResult {
  hasAccess: boolean;
  isProjectOwner: boolean;
  isAdmin: boolean;
  isTeamMember: boolean;
  reason?: string;
}

/**
 * Check if the current user has access to a project
 * This uses direct queries to avoid recursive RLS issues
 */
export const checkUserProjectAccess = async (projectId: string): Promise<ProjectAccessResult> => {
  try {
    // Default response
    const result: ProjectAccessResult = {
      hasAccess: false,
      isProjectOwner: false,
      isAdmin: false,
      isTeamMember: false
    };
    
    if (!projectId) {
      result.reason = 'No project ID provided';
      return result;
    }
    
    // Get current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData.user) {
      debugError('ACCESS', 'Authentication error or user not found:', authError);
      result.reason = 'User not authenticated';
      return result;
    }
    
    const userId = authData.user.id;
    debugLog('ACCESS', `Checking project access for user ${userId} and project ${projectId}`);
    
    // Use the new v2 access check function to avoid RLS recursion issues
    const { data: hasAccess, error: accessError } = await supabase.rpc(
      'check_project_access_v2',
      { p_project_id: projectId }
    );
    
    if (accessError) {
      debugError('ACCESS', 'Error checking project access:', accessError);
    } else if (hasAccess) {
      result.hasAccess = true;
      
      // Now determine what type of access the user has
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .maybeSingle();
      
      if (!projectError && projectData && projectData.user_id === userId) {
        result.isProjectOwner = true;
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (!profileError && profileData && profileData.role === 'admin') {
        result.isAdmin = true;
      }
      
      // If user is not owner or admin but has access, they must be a team member
      if (!result.isProjectOwner && !result.isAdmin) {
        result.isTeamMember = true;
      }
      
      return result;
    }
    
    // If we get here, user doesn't have access
    result.reason = 'User is not authorized to access this project';
    return result;
    
  } catch (error) {
    debugError('ACCESS', 'Exception in checkUserProjectAccess:', error);
    return {
      hasAccess: false,
      isProjectOwner: false,
      isAdmin: false,
      isTeamMember: false,
      reason: 'Error checking project access'
    };
  }
};
