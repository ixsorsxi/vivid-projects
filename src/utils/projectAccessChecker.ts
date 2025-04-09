
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
    
    // Check if user is project owner (most reliable query)
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (projectError) {
      debugError('ACCESS', 'Error checking project ownership:', projectError);
    } else if (projectData && projectData.user_id === userId) {
      result.isProjectOwner = true;
      result.hasAccess = true;
      return result;
    }
    
    // Check if user is admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      debugError('ACCESS', 'Error checking user profile:', profileError);
    } else if (profileData && profileData.role === 'admin') {
      result.isAdmin = true;
      result.hasAccess = true;
      return result;
    }
    
    // Check if user is a member of the project (may have RLS issues, so use RPC)
    try {
      const { data: isMember, error: memberError } = await supabase.rpc(
        'is_member_of_project', 
        { p_project_id: projectId }
      );
      
      if (memberError) {
        debugError('ACCESS', 'Error checking project membership via RPC:', memberError);
      } else if (isMember) {
        result.isTeamMember = true;
        result.hasAccess = true;
        return result;
      }
    } catch (rpcError) {
      debugError('ACCESS', 'RPC call failed:', rpcError);
      
      // Try direct query as fallback (might hit RLS)
      const { data: memberData, error: directMemberError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (directMemberError) {
        debugError('ACCESS', 'Error with direct membership check:', directMemberError);
      } else if (memberData) {
        result.isTeamMember = true;
        result.hasAccess = true;
        return result;
      }
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
