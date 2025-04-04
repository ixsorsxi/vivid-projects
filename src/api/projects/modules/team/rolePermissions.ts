
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole, ProjectPermission, ProjectRoleKey, ProjectPermissionName } from './types';

/**
 * Fetches all available project roles
 */
export const fetchProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    // Using rpc to get roles
    const { data, error } = await supabase.rpc('get_project_roles');
    
    if (error) {
      console.error('Error fetching project roles:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format returned from RPC:', data);
      return [];
    }
    
    // Explicitly cast and validate the data
    const roles = data.map((role: any): ProjectRole => ({
      id: role.id,
      role_key: role.role_key as ProjectRoleKey,
      description: role.description,
      created_at: role.created_at
    }));
    
    return roles;
  } catch (error) {
    console.error('Exception in fetchProjectRoles:', error);
    return [];
  }
};

/**
 * Fetches all available project permissions
 */
export const fetchProjectPermissions = async (): Promise<ProjectPermission[]> => {
  try {
    // Using rpc to get permissions
    const { data, error } = await supabase.rpc('get_project_permissions');
    
    if (error) {
      console.error('Error fetching project permissions:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format returned from RPC:', data);
      return [];
    }
    
    // Explicitly cast and validate the data
    const permissions = data.map((permission: any): ProjectPermission => ({
      id: permission.id,
      permission_name: permission.permission_name as ProjectPermissionName,
      description: permission.description,
      created_at: permission.created_at
    }));
    
    return permissions;
  } catch (error) {
    console.error('Exception in fetchProjectPermissions:', error);
    return [];
  }
};

/**
 * Fetches permissions for a specific role
 */
export const fetchPermissionsForRole = async (roleKey: ProjectRoleKey): Promise<ProjectPermission[]> => {
  try {
    // Using rpc to get permissions for a role
    const { data, error } = await supabase.rpc('get_permissions_for_role', { p_role_key: roleKey });
    
    if (error) {
      console.error('Error fetching role permissions:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format returned from RPC:', data);
      return [];
    }
    
    // Explicitly cast and validate the data
    const permissions = data.map((permission: any): ProjectPermission => ({
      id: permission.id,
      permission_name: permission.permission_name as ProjectPermissionName,
      description: permission.description,
      created_at: permission.created_at
    }));
    
    return permissions;
  } catch (error) {
    console.error('Exception in fetchPermissionsForRole:', error);
    return [];
  }
};

/**
 * Checks if a user has a specific permission for a project using the DB function
 */
export const checkUserProjectPermission = async (
  projectId: string,
  userId: string,
  permission: ProjectPermissionName
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('has_project_permission', {
        p_project_id: projectId,
        p_user_id: userId,
        p_permission: permission
      });
    
    if (error) {
      console.error('Error checking project permission:', error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error('Exception in checkUserProjectPermission:', error);
    return false;
  }
};

/**
 * Fetches all permissions a user has for a project
 */
export const fetchUserProjectPermissions = async (
  projectId: string,
  userId: string
): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_project_permissions', {
        p_project_id: projectId,
        p_user_id: userId
      });
    
    if (error) {
      console.error('Error fetching user project permissions:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    if (Array.isArray(data)) {
      return data as string[];
    }
    
    console.warn('Unexpected data format from get_user_project_permissions:', data);
    return [];
  } catch (error) {
    console.error('Exception in fetchUserProjectPermissions:', error);
    return [];
  }
};

/**
 * Gets the role description for a given role key
 */
export const getRoleDescription = async (roleKey: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('get_role_description', { p_role_key: roleKey });
    
    if (error || data === null) {
      console.error('Error fetching role description:', error);
      return '';
    }
    
    return data as string;
  } catch (error) {
    console.error('Exception in getRoleDescription:', error);
    return '';
  }
};

/**
 * Maps the legacy role string to a valid ProjectRoleKey
 * This helps with backward compatibility for existing data
 */
export const mapLegacyRole = (role: string): ProjectRoleKey => {
  if (!role) return 'team_member';
  
  // First normalize the role string
  const normalizedRole = role.toLowerCase().trim();
  
  const roleMap: Record<string, ProjectRoleKey> = {
    'project manager': 'project_manager',
    'team member': 'team_member',
    'member': 'team_member',
    'developer': 'developer',
    'designer': 'designer',
    'qa': 'qa_tester',
    'tester': 'qa_tester',
    'client': 'client_stakeholder',
    'stakeholder': 'client_stakeholder',
    'observer': 'observer_viewer',
    'viewer': 'observer_viewer',
    'admin': 'admin',
    'scrum master': 'scrum_master',
    'business analyst': 'business_analyst',
    'coordinator': 'coordinator',
    'owner': 'project_owner',
    'project owner': 'project_owner',
    
    // Handle kebab-case and snake_case versions too
    'project-manager': 'project_manager',
    'project_manager': 'project_manager',
    'team-member': 'team_member',
    'team_member': 'team_member',
    'qa-tester': 'qa_tester',
    'qa_tester': 'qa_tester',
    'client-stakeholder': 'client_stakeholder',
    'client_stakeholder': 'client_stakeholder',
    'observer-viewer': 'observer_viewer',
    'observer_viewer': 'observer_viewer',
    'scrum-master': 'scrum_master',
    'scrum_master': 'scrum_master',
    'business-analyst': 'business_analyst',
    'business_analyst': 'business_analyst',
    'project-owner': 'project_owner',
    'project_owner': 'project_owner'
  };
  
  return (roleMap[normalizedRole] || 'team_member') as ProjectRoleKey;
};
