
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Check if the current user has access to modify a project
 */
export async function checkUserProjectAccess(projectId: string): Promise<{
  hasAccess: boolean;
  reason?: string;
  isProjectOwner?: boolean;
  isAdmin?: boolean;
  isProjectMember?: boolean;
}> {
  try {
    // Get current user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      debugError('ACCESS', 'Authentication error:', authError);
      return { 
        hasAccess: false, 
        reason: 'Authentication error' 
      };
    }
    
    if (!authData || !authData.user) {
      return { 
        hasAccess: false, 
        reason: 'No authenticated user'
      };
    }
    
    const currentUserId = authData.user.id;
    debugLog('ACCESS', `Checking project access for user ${currentUserId} on project ${projectId}`);
    
    // CHECK 1: Check if user is project owner using direct query
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .maybeSingle();
      
      if (projectError) {
        debugError('ACCESS', 'Error checking project ownership:', projectError);
      } else if (projectData && projectData.user_id === currentUserId) {
        // User is the project owner
        debugLog('ACCESS', `Access GRANTED: User ${currentUserId} is owner of project ${projectId}`);
        return {
          hasAccess: true,
          isProjectOwner: true,
          isAdmin: false,
          isProjectMember: false
        };
      } else {
        debugLog('ACCESS', `User ${currentUserId} is NOT the owner of project ${projectId}`);
      }
    } catch (error) {
      debugError('ACCESS', 'Exception checking project ownership:', error);
    }
    
    // CHECK 2: Check if user is admin using direct query
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .maybeSingle();
      
      if (profileError) {
        debugError('ACCESS', 'Error checking user profile:', profileError);
      } else if (profileData?.role === 'admin') {
        // User is an admin
        debugLog('ACCESS', `Access GRANTED: User ${currentUserId} is admin`);
        return {
          hasAccess: true,
          isProjectOwner: false,
          isAdmin: true,
          isProjectMember: false
        };
      } else {
        debugLog('ACCESS', `User ${currentUserId} is NOT an admin`);
      }
    } catch (error) {
      debugError('ACCESS', 'Exception checking admin status:', error);
    }
    
    // CHECK 3: Check if user is project member using direct query
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('id, role')
        .eq('project_id', projectId)
        .eq('user_id', currentUserId)
        .maybeSingle();
      
      if (memberError && memberError.code !== 'PGRST116') {
        debugError('ACCESS', 'Error checking project membership:', memberError);
      } else if (memberData) {
        // User is a project member
        debugLog('ACCESS', `Access GRANTED: User ${currentUserId} is member of project ${projectId} with role ${memberData.role}`);
        return {
          hasAccess: true,
          isProjectOwner: false,
          isAdmin: false,
          isProjectMember: true
        };
      } else {
        debugLog('ACCESS', `User ${currentUserId} is NOT a member of project ${projectId}`);
      }
    } catch (error) {
      debugError('ACCESS', 'Exception checking project membership:', error);
    }
    
    // If we got here, user doesn't have access
    debugLog(
      'ACCESS',
      `Access DENIED: User ${currentUserId} has no access to project ${projectId}: not owner/admin/member`
    );
    
    return {
      hasAccess: false,
      isProjectOwner: false,
      isAdmin: false,
      isProjectMember: false,
      reason: 'User is not the project owner, admin, or a project member'
    };
  } catch (error) {
    debugError('ACCESS', 'Unexpected error checking project access:', error);
    
    return {
      hasAccess: false,
      reason: 'Unexpected error checking access'
    };
  }
}
