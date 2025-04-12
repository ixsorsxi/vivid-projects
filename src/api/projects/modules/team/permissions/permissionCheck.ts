
import { supabase } from '@/integrations/supabase/client';
import { ProjectPermissionName } from './types';

/**
 * Checks if a user has a specific permission in a project
 */
export const hasProjectPermission = async (
  userId: string,
  projectId: string,
  permission: ProjectPermissionName
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'has_project_permission',
      { 
        p_user_id: userId, 
        p_project_id: projectId,
        p_permission: permission
      }
    );

    if (error) {
      console.error('Error checking permission:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in hasProjectPermission:', error);
    return false;
  }
};

/**
 * Alias for hasProjectPermission (for backward compatibility)
 */
export const checkUserProjectPermission = hasProjectPermission;
