import { supabase } from '@/integrations/supabase/client';

/**
 * Determines if the specified user is the project manager for the given project
 */
export const isUserProjectManager = async (
  userId: string,
  projectId: string
): Promise<boolean> => {
  try {
    // Check if the user role is project_manager
    const { data, error } = await supabase
      .from('user_project_roles')
      .select('project_roles(role_key)')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.project_roles?.role_key === 'project_manager';
  } catch (error) {
    console.error('Error in isUserProjectManager:', error);
    return false;
  }
};

/**
 * Finds the project manager for a specific project
 */
export const findProjectManager = async (projectId: string): Promise<string | null> => {
  try {
    // First try to get the project_manager_id from the projects table
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('project_manager_id')
      .eq('id', projectId)
      .single();

    // If we have a project manager ID in the projects table, return it
    if (!projectError && project && project.project_manager_id) {
      return project.project_manager_id;
    }

    // Otherwise look for users with the project_manager role
    const { data: managerRole, error: roleError } = await supabase
      .from('user_project_roles')
      .select('user_id')
      .eq('project_id', projectId)
      .eq('project_roles.role_key', 'project_manager')
      .limit(1)
      .single();

    if (roleError || !managerRole) {
      return null;
    }

    return managerRole.user_id;
  } catch (error) {
    console.error('Error in findProjectManager:', error);
    return null;
  }
};

/**
 * Fetches the name of the project manager
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    const managerId = await findProjectManager(projectId);

    if (!managerId) return null;

    // Get the manager's name from profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', managerId)
      .single();

    if (error || !profile) return null;

    return profile.full_name;
  } catch (error) {
    console.error('Error in fetchProjectManagerName:', error);
    return null;
  }
};
