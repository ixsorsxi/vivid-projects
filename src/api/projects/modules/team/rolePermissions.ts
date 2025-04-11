
import { supabase } from '@/integrations/supabase/client';
import { ProjectRoleKey, ProjectPermissionName } from './types';

/**
 * Gets the role for a user in a specific project
 */
export const getUserProjectRole = async (
  userId: string,
  projectId: string
): Promise<ProjectRoleKey | null> => {
  try {
    const { data, error } = await supabase
      .from('user_project_roles')
      .select('project_role_id, project_roles!inner(role_key)')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (error || !data) {
      console.log('User has no role in this project:', error);
      return null;
    }

    return data.project_roles.role_key as ProjectRoleKey;
  } catch (error) {
    console.error('Error in getUserProjectRole:', error);
    return null;
  }
};

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

    return data as ProjectPermissionName[];
  } catch (error) {
    console.error('Error in getUserProjectPermissions:', error);
    return [];
  }
};

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
 * Assigns a role to a user in a project
 */
export const assignProjectRole = async (
  userId: string,
  projectId: string,
  roleKey: ProjectRoleKey
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'assign_project_role',
      {
        p_user_id: userId,
        p_project_id: projectId,
        p_role_key: roleKey
      }
    );

    if (error) {
      console.error('Error assigning role:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in assignProjectRole:', error);
    return false;
  }
};
