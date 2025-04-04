
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole, ProjectPermission, ProjectRoleKey, ProjectPermissionName } from './types';

/**
 * Fetches all available project roles
 */
export const fetchProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    // Using rpc to get roles instead of direct table access
    const { data, error } = await supabase.rpc('get_project_roles');
    
    if (error) {
      console.error('Error fetching project roles:', error);
      return [];
    }
    
    return data || [];
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
    // Using rpc to get permissions instead of direct table access
    const { data, error } = await supabase.rpc('get_project_permissions');
    
    if (error) {
      console.error('Error fetching project permissions:', error);
      return [];
    }
    
    return data || [];
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
    
    return data || [];
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
    
    return data || false;
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
    
    return Array.isArray(data) ? data : [];
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
    
    if (error || !data) {
      console.error('Error fetching role description:', error);
      return '';
    }
    
    return data;
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
  const roleMap: Record<string, ProjectRoleKey> = {
    'Project Manager': 'project_manager',
    'Team Member': 'team_member',
    'Member': 'team_member',
    'Developer': 'developer',
    'Designer': 'designer',
    'QA': 'qa_tester',
    'Tester': 'qa_tester',
    'Client': 'client_stakeholder',
    'Stakeholder': 'client_stakeholder',
    'Observer': 'observer_viewer',
    'Viewer': 'observer_viewer',
    'Admin': 'admin',
    'Scrum Master': 'scrum_master',
    'Business Analyst': 'business_analyst',
    'Coordinator': 'coordinator',
    'Owner': 'project_owner',
    'Project Owner': 'project_owner'
  };
  
  return roleMap[role] || 'team_member';
};
