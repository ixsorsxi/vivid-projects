
import { supabase } from '@/integrations/supabase/client';
import { ProjectRole, ProjectPermission, ProjectRoleKey } from './types';

/**
 * Fetches all available project roles
 */
export const fetchProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_project_roles' as any
    );
    
    if (error) {
      console.error('Error fetching project roles:', error);
      return [];
    }
    
    // Cast the data to the correct type
    return (data as any) || [];
  } catch (error) {
    console.error('Error in fetchProjectRoles:', error);
    return [];
  }
};

/**
 * Fetches all available project permissions
 */
export const fetchProjectPermissions = async (): Promise<ProjectPermission[]> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_project_permissions' as any
    );
    
    if (error) {
      console.error('Error fetching project permissions:', error);
      return [];
    }
    
    // Cast the data to the correct type
    return (data as any) || [];
  } catch (error) {
    console.error('Error in fetchProjectPermissions:', error);
    return [];
  }
};

/**
 * Fetches permissions associated with a specific role
 */
export const fetchPermissionsForRole = async (roleKey: string): Promise<ProjectPermission[]> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_permissions_for_role' as any,
      { p_role_key: roleKey }
    );
    
    if (error) {
      console.error(`Error fetching permissions for role ${roleKey}:`, error);
      return [];
    }
    
    // Cast the data to the correct type
    return (data as any) || [];
  } catch (error) {
    console.error('Error in fetchPermissionsForRole:', error);
    return [];
  }
};

/**
 * Checks if the current user has a specific permission for a project
 */
export const checkUserProjectPermission = async (
  projectId: string, 
  permissionName: string
): Promise<boolean> => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      console.error('No authenticated user found');
      return false;
    }

    const { data, error } = await supabase.rpc(
      'has_project_permission',
      {
        p_project_id: projectId,
        p_user_id: authData.user.id,
        p_permission: permissionName
      }
    );

    if (error) {
      console.error(`Error checking permission ${permissionName}:`, error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkUserProjectPermission:', error);
    return false;
  }
};

/**
 * Fetches all permissions for the current user in a project
 */
export const fetchUserProjectPermissions = async (projectId: string): Promise<string[]> => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      console.error('No authenticated user found');
      return [];
    }

    const { data, error } = await supabase.rpc(
      'get_user_project_permissions',
      {
        p_project_id: projectId,
        p_user_id: authData.user.id
      }
    );

    if (error) {
      console.error('Error fetching user project permissions:', error);
      return [];
    }

    return data as string[] || [];
  } catch (error) {
    console.error('Error in fetchUserProjectPermissions:', error);
    return [];
  }
};

/**
 * Gets the description for a role
 */
export const getRoleDescription = async (roleKey: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_role_description' as any,
      { p_role_key: roleKey }
    );

    if (error) {
      console.error(`Error fetching description for role ${roleKey}:`, error);
      return null;
    }

    return data as string;
  } catch (error) {
    console.error('Error in getRoleDescription:', error);
    return null;
  }
};

/**
 * Maps legacy role names to the new standardized format
 */
export const mapLegacyRole = (role: string): ProjectRoleKey => {
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
  
  // Map from old format to new format
  const roleMap: Record<string, ProjectRoleKey> = {
    'project manager': 'project_manager',
    'team member': 'team_member',
    'team-member': 'team_member',
    'member': 'team_member',
    'admin': 'admin',
    'developer': 'developer',
    'qa tester': 'qa_tester',
    'qa': 'qa_tester',
    'designer': 'designer',
    'owner': 'project_owner',
    'project owner': 'project_owner',
    'stakeholder': 'client_stakeholder',
    'client': 'client_stakeholder',
    'viewer': 'observer_viewer',
    'observer': 'observer_viewer',
    'scrum master': 'scrum_master',
    'analyst': 'business_analyst',
    'ba': 'business_analyst',
    'coordinator': 'coordinator'
  };
  
  // Return the mapped role or the original if no mapping is found
  return (roleMap[normalizedRole] as ProjectRoleKey) || 
         (normalizedRole as ProjectRoleKey) || 
         'team_member';
};
