
import { supabase } from '@/integrations/supabase/client';
import { ProjectRoleKey, ProjectPermissionName } from './types';

/**
 * Fetches all available project roles
 */
export const fetchProjectRoles = async (): Promise<{ id: string; role_key: ProjectRoleKey; description: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('project_roles')
      .select('id, role_key, description')
      .order('role_key');

    if (error) {
      console.error('Error fetching project roles:', error);
      return [];
    }

    // Convert the role_key strings to ProjectRoleKey type
    return data.map(role => ({
      id: role.id,
      role_key: role.role_key as ProjectRoleKey,
      description: role.description
    }));
  } catch (error) {
    console.error('Error in fetchProjectRoles:', error);
    return [];
  }
};

/**
 * Fetches all available project permissions
 */
export const fetchProjectPermissions = async (): Promise<{ id: string; permission_name: ProjectPermissionName; description: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('project_permissions')
      .select('id, permission_name, description')
      .order('permission_name');

    if (error) {
      console.error('Error fetching project permissions:', error);
      return [];
    }

    // Convert the permission_name strings to ProjectPermissionName type
    return data.map(permission => ({
      id: permission.id,
      permission_name: permission.permission_name as unknown as ProjectPermissionName,
      description: permission.description
    }));
  } catch (error) {
    console.error('Error in fetchProjectPermissions:', error);
    return [];
  }
};

/**
 * Fetches permissions associated with a specific role
 */
export const fetchPermissionsForRole = async (roleKey: ProjectRoleKey): Promise<ProjectPermissionName[]> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_permissions_for_role',
      { p_role_key: roleKey }
    );

    if (error) {
      console.error('Error fetching permissions for role:', error);
      return [];
    }

    // Check data format and extract permission names
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'string') {
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
    console.error('Error in fetchPermissionsForRole:', error);
    return [];
  }
};

/**
 * Gets the description for a role
 */
export const getRoleDescription = async (roleKey: ProjectRoleKey): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_role_description',
      { p_role_key: roleKey }
    );

    if (error) {
      console.error('Error fetching role description:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getRoleDescription:', error);
    return null;
  }
};
