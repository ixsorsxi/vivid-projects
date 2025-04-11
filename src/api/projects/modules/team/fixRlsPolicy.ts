
import { supabase } from '@/integrations/supabase/client';
import { ProjectPermissionName } from './types';

/**
 * Checks if a user has a specific permission for a project using the new structure
 */
export const checkPermission = async (
  projectId: string,
  userId: string,
  permission: ProjectPermissionName
): Promise<boolean> => {
  try {
    // Use the new has_project_permission function
    const { data, error } = await supabase.rpc(
      'has_project_permission',
      { 
        p_user_id: userId, 
        p_project_id: projectId, 
        p_permission: permission 
      }
    );
    
    if (error) {
      console.error('Error checking project permission:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception in checkPermission:', error);
    return false;
  }
};

/**
 * Gets all permissions a user has for a project
 */
export const getUserProjectPermissions = async (
  projectId: string,
  userId: string
): Promise<ProjectPermissionName[]> => {
  try {
    // Use the new get_user_project_permissions function
    const { data, error } = await supabase.rpc(
      'get_user_project_permissions',
      { 
        p_user_id: userId, 
        p_project_id: projectId
      }
    );
    
    if (error) {
      console.error('Error getting user project permissions:', error);
      return [];
    }
    
    // Fix the type issue by extracting just the permission_name strings from the response objects
    return (data || []).map(item => item.permission_name as ProjectPermissionName);
  } catch (error) {
    console.error('Exception in getUserProjectPermissions:', error);
    return [];
  }
};

/**
 * Assigns a role to a user for a project
 */
export const assignProjectRole = async (
  projectId: string,
  userId: string,
  roleKey: string
): Promise<boolean> => {
  try {
    // Use the new assign_project_role function
    const { data, error } = await supabase.rpc(
      'assign_project_role',
      { 
        p_user_id: userId, 
        p_project_id: projectId, 
        p_role_key: roleKey 
      }
    );
    
    if (error) {
      console.error('Error assigning project role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception in assignProjectRole:', error);
    return false;
  }
};
