
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from './debugLogger';

interface AccessCheckResult {
  hasAccess: boolean;
  isProjectOwner: boolean;
  isAdmin: boolean;
  reason?: string;
}

/**
 * Checks if the current user has access to a specific project
 */
export const checkUserProjectAccess = async (projectId: string): Promise<AccessCheckResult> => {
  try {
    // Get current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData?.user) {
      debugError('ACCESS', 'Authentication error or no user:', authError);
      return {
        hasAccess: false,
        isProjectOwner: false,
        isAdmin: false,
        reason: 'User not authenticated'
      };
    }
    
    debugLog('ACCESS', 'Checking project access for user:', authData.user.id);
    
    // First check if user is project owner
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
      
    if (projectError) {
      debugError('ACCESS', 'Error fetching project:', projectError);
      return {
        hasAccess: false,
        isProjectOwner: false,
        isAdmin: false,
        reason: 'Error fetching project data'
      };
    }
    
    // If user is project owner, they have full access
    if (project && project.user_id === authData.user.id) {
      debugLog('ACCESS', 'User is project owner');
      return {
        hasAccess: true,
        isProjectOwner: true,
        isAdmin: false
      };
    }
    
    // Check if user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle();
      
    if (profileError) {
      debugError('ACCESS', 'Error fetching user profile:', profileError);
    }
    
    const isAdmin = profile?.role === 'admin';
    
    if (isAdmin) {
      debugLog('ACCESS', 'User is an admin, granting access');
      return {
        hasAccess: true,
        isProjectOwner: false,
        isAdmin: true
      };
    }
    
    // Try to directly check if the user is a project member to avoid RLS recursion
    try {
      const { data: isProjectMember, error: rpcError } = await supabase
        .rpc('is_member_of_project', { p_project_id: projectId });
        
      if (rpcError) {
        debugError('ACCESS', 'RPC error checking project membership:', rpcError);
      }
      
      if (isProjectMember) {
        debugLog('ACCESS', 'User is a project member');
        return {
          hasAccess: true,
          isProjectOwner: false,
          isAdmin: false
        };
      }
    } catch (error) {
      debugError('ACCESS', 'Error checking project membership:', error);
    }
    
    // If we get here, the user doesn't have access
    return {
      hasAccess: false,
      isProjectOwner: false,
      isAdmin: false,
      reason: 'User is not a project owner or member'
    };
  } catch (error) {
    debugError('ACCESS', 'Unexpected error in checkUserProjectAccess:', error);
    return {
      hasAccess: false,
      isProjectOwner: false,
      isAdmin: false,
      reason: 'Unexpected error checking access'
    };
  }
};
