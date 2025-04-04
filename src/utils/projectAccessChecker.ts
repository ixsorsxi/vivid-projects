
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
    
    // Check if user is project owner
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
      return { 
        hasAccess: false, 
        reason: 'Error checking project ownership' 
      };
    }
    
    const isProjectOwner = projectData.user_id === currentUserId;
    
    // Check if user is admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUserId)
      .single();
    
    if (profileError) {
      debugError('ACCESS', 'Error checking user profile:', profileError);
    }
    
    const isAdmin = profileData?.role === 'admin';
    
    // Check if user is a project member
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', currentUserId)
      .single();
    
    if (memberError && memberError.code !== 'PGRST116') {
      debugError('ACCESS', 'Error checking project membership:', memberError);
    }
    
    const isProjectMember = !!memberData;
    
    // User has access if they're the owner, an admin, or a project member
    const hasAccess = isProjectOwner || isAdmin || isProjectMember;
    
    debugLog(
      'ACCESS',
      `User ${currentUserId} access to project ${projectId}:`,
      { hasAccess, isProjectOwner, isAdmin, isProjectMember }
    );
    
    return {
      hasAccess,
      isProjectOwner,
      isAdmin,
      isProjectMember,
      reason: hasAccess 
        ? undefined 
        : 'User is not the project owner, admin, or a project member'
    };
  } catch (error) {
    debugError('ACCESS', 'Unexpected error checking project access:', error);
    
    return {
      hasAccess: false,
      reason: 'Unexpected error checking access'
    };
  }
}
