
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

    // Check the shape of the data and handle it appropriately
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'string') {
        // If data is already a string array
        return data as ProjectPermissionName[];
      } else if (data.length > 0 && typeof data[0] === 'object' && 'permission_name' in data[0]) {
        // Use a type assertion with 'as unknown' first to avoid the type error
        return (data as unknown as Array<{permission_name: string}>)
          .map(item => item.permission_name as ProjectPermissionName);
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

/**
 * Assigns a role to a user in a project
 */
export const assignProjectRole = async (
  userId: string,
  projectId: string,
  roleKey: ProjectRoleKey | string
): Promise<boolean> => {
  try {
    // Ensure roleKey is valid by casting it
    const validRoleKey = roleKey as ProjectRoleKey;
    
    const { data, error } = await supabase.rpc(
      'assign_project_role',
      {
        p_user_id: userId,
        p_project_id: projectId,
        p_role_key: validRoleKey
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
      permission_name: permission.permission_name as ProjectPermissionName,
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
        return data as ProjectPermissionName[];
      } else if (data.length > 0 && typeof data[0] === 'object' && 'permission_name' in data[0]) {
        // Use a type assertion with 'as unknown' first to avoid the type error
        return (data as unknown as Array<{permission_name: string}>)
          .map(item => item.permission_name as ProjectPermissionName);
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

/**
 * Maps legacy role names to standardized role keys
 */
export const mapLegacyRole = (role: string): ProjectRoleKey => {
  // Normalize the role string
  const normalizedRole = role.toLowerCase().replace(/[\s-]/g, '_');
  
  // Map to valid ProjectRoleKey values
  switch (normalizedRole) {
    case 'project_manager':
    case 'project-manager':
    case 'projectmanager':
      return 'project_manager';
    case 'project_owner':
    case 'project-owner':
    case 'projectowner':
    case 'owner':
      return 'project_owner';
    case 'admin':
    case 'administrator':
      return 'admin';
    case 'developer':
    case 'dev':
      return 'developer';
    case 'designer':
      return 'designer';
    case 'client_stakeholder':
    case 'client-stakeholder':
    case 'client':
    case 'stakeholder':
      return 'client_stakeholder';
    case 'observer_viewer':
    case 'observer':
    case 'viewer':
      return 'observer_viewer';
    case 'qa_tester':
    case 'qa':
    case 'tester':
      return 'qa_tester';
    case 'scrum_master':
    case 'scrummaster':
      return 'scrum_master';
    case 'business_analyst':
    case 'analyst':
      return 'business_analyst';
    case 'coordinator':
      return 'coordinator';
    default:
      return 'team_member'; // Default fallback
  }
};
