
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole, ProjectPermissionName } from './types';

/**
 * Fetches available project roles
 */
export const fetchProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    const { data, error } = await supabase
      .from('project_roles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching project roles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProjectRoles:', error);
    return [];
  }
};

/**
 * Fetches all permissions for a project
 */
export const fetchProjectPermissions = async (): Promise<ProjectPermissionName[]> => {
  try {
    const { data, error } = await supabase
      .from('project_permissions')
      .select('permission_name')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching project permissions:', error);
      return [];
    }

    return (data || []).map(p => p.permission_name as ProjectPermissionName);
  } catch (error) {
    console.error('Error in fetchProjectPermissions:', error);
    return [];
  }
};

/**
 * Fetches permissions for a specific role
 */
export const fetchPermissionsForRole = async (roleId: string): Promise<ProjectPermissionName[]> => {
  try {
    const { data, error } = await supabase
      .from('project_role_permissions')
      .select('project_permissions(permission_name)')
      .eq('role_id', roleId);

    if (error) {
      console.error('Error fetching permissions for role:', error);
      return [];
    }

    return (data || []).map(p => p.project_permissions.permission_name as ProjectPermissionName);
  } catch (error) {
    console.error('Error in fetchPermissionsForRole:', error);
    return [];
  }
};

/**
 * Checks if a user has a specific permission for a project
 */
export const checkUserProjectPermission = async (
  projectId: string,
  userId: string,
  permissionName: ProjectPermissionName
): Promise<boolean> => {
  try {
    // For now, just implement basic logic without actual role-based checks
    return true;
  } catch (error) {
    console.error('Error in checkUserProjectPermission:', error);
    return false;
  }
};

/**
 * Fetches all permissions a user has for a project
 */
export const fetchUserProjectPermissions = async (
  projectId: string,
  userId: string
): Promise<ProjectPermissionName[]> => {
  try {
    // For now, return all permissions
    return await fetchProjectPermissions();
  } catch (error) {
    console.error('Error in fetchUserProjectPermissions:', error);
    return [];
  }
};

/**
 * Gets a human-readable description for a role
 */
export const getRoleDescription = (role: string): string => {
  switch (role) {
    case 'project_manager':
      return 'Manages the project and has complete control';
    case 'team_member':
      return 'Works on project tasks and collaborates with the team';
    case 'developer':
      return 'Creates and implements technical solutions';
    case 'designer':
      return 'Designs visual and user experience elements';
    case 'client_stakeholder':
      return 'External stakeholder with limited access';
    default:
      return 'Team member with standard access';
  }
};

/**
 * Maps legacy role formats to the new format
 */
export const mapLegacyRole = (role: string): string => {
  if (!role) return 'team_member';
  
  // Convert spaces to underscores and lowercase
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
  
  // Map known legacy values
  switch (normalizedRole) {
    case 'project_manager':
    case 'projectmanager':
    case 'manager':
      return 'project_manager';
    case 'developer':
    case 'dev':
      return 'developer';
    case 'designer':
    case 'ux_designer':
    case 'ui_designer':
      return 'designer';
    case 'client':
    case 'stakeholder':
    case 'client_stakeholder':
      return 'client_stakeholder';
    default:
      return 'team_member';
  }
};
