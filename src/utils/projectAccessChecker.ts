
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

interface ProjectAccessResult {
  hasAccess: boolean;
  isProjectOwner: boolean;
  isAdmin: boolean;
  reason?: string;
}

/**
 * Checks if the current user has access to modify a project
 * This avoids potential RLS infinite recursion issues by making direct queries
 */
export const checkUserProjectAccess = async (projectId: string): Promise<ProjectAccessResult> => {
  try {
    // Get current authenticated user
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    if (!currentUser) {
      return { 
        hasAccess: false, 
        isProjectOwner: false, 
        isAdmin: false,
        reason: 'Not authenticated' 
      };
    }
    
    // Check if user is project owner
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (projectError) {
      debugError('ACCESS', 'Error checking project ownership:', projectError);
      return { 
        hasAccess: false, 
        isProjectOwner: false, 
        isAdmin: false,
        reason: 'Error checking project data' 
      };
    }
    
    const isProjectOwner = projectData?.user_id === currentUser.id;
    
    // Check if user is admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();
      
    if (profileError) {
      debugError('ACCESS', 'Error checking user role:', profileError);
      return { 
        hasAccess: isProjectOwner, 
        isProjectOwner, 
        isAdmin: false,
        reason: isProjectOwner ? undefined : 'Error checking user role' 
      };
    }
    
    const isAdmin = profileData?.role === 'admin';
    
    // User has access if they are either the project owner or an admin
    const hasAccess = isProjectOwner || isAdmin;
    
    return {
      hasAccess,
      isProjectOwner,
      isAdmin,
      reason: hasAccess ? undefined : 'User is not project owner or admin'
    };
  } catch (error) {
    debugError('ACCESS', 'Exception in checkUserProjectAccess:', error);
    return { 
      hasAccess: false, 
      isProjectOwner: false, 
      isAdmin: false,
      reason: 'Exception checking access' 
    };
  }
};
