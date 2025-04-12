
import { supabase } from '@/integrations/supabase/client';
import { ProjectPermissionName } from './types';

/**
 * Gets all permissions for a user in a project
 */
export const getUserProjectPermissions = async (
  userId: string,
  projectId: string
): Promise<ProjectPermissionName[]> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_user_project_permissions',
      { p_user_id: userId, p_project_id: projectId }
    );

    if (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }

    // Check the shape of the data and handle it appropriately
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'string') {
        // If data is already a string array
        return data as unknown as ProjectPermissionName[];
      } else if (data.length > 0 && typeof data[0] === 'object' && 'permission_name' in data[0]) {
        // Extract permission_name property from each object and cast to ProjectPermissionName
        // Use type assertion with 'as unknown as' pattern to safely convert
        return data.map((item: { permission_name: string }) => 
          item.permission_name as unknown as ProjectPermissionName
        );
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error in getUserProjectPermissions:', error);
    return [];
  }
};

/**
 * Alias for getUserProjectPermissions (for backward compatibility)
 */
export const fetchUserProjectPermissions = getUserProjectPermissions;
