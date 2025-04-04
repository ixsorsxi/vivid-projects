
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
    
    // Check if user is project owner (Handle potential SQL errors separately)
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        if (projectError.code === 'PGRST116') {
          debugError('ACCESS', 'Project not found:', projectId);
          return { 
            hasAccess: false, 
            reason: 'Project not found' 
          };
        }
        
        debugError('ACCESS', 'Error checking project ownership:', projectError);
        // Continue checking other access methods rather than failing immediately
      } else if (projectData && projectData.user_id === currentUserId) {
        // User is the project owner
        debugLog('ACCESS', `User ${currentUserId} is owner of project ${projectId}`);
        return {
          hasAccess: true,
          isProjectOwner: true,
          isAdmin: false,
          isProjectMember: false
        };
      }
    } catch (error) {
      debugError('ACCESS', 'Exception checking project ownership:', error);
      // Continue to other checks
    }
    
    // Check if user is admin
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single();
      
      if (!profileError && profileData?.role === 'admin') {
        // User is an admin
        debugLog('ACCESS', `User ${currentUserId} is admin, granting access to project ${projectId}`);
        return {
          hasAccess: true,
          isProjectOwner: false,
          isAdmin: true,
          isProjectMember: false
        };
      }
      
      if (profileError) {
        debugError('ACCESS', 'Error checking user profile:', profileError);
      }
    } catch (error) {
      debugError('ACCESS', 'Exception checking admin status:', error);
    }
    
    // Check if user is a project member
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', currentUserId)
        .single();
      
      if (!memberError && memberData) {
        // User is a project member
        debugLog('ACCESS', `User ${currentUserId} is member of project ${projectId}`);
        return {
          hasAccess: true,
          isProjectOwner: false,
          isAdmin: false,
          isProjectMember: true
        };
      }
      
      if (memberError && memberError.code !== 'PGRST116') {
        debugError('ACCESS', 'Error checking project membership:', memberError);
      }
    } catch (error) {
      debugError('ACCESS', 'Exception checking project membership:', error);
    }
    
    // If we got here, user doesn't have access
    debugLog(
      'ACCESS',
      `User ${currentUserId} denied access to project ${projectId}: not owner/admin/member`
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
