
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/projects/team/types';

/**
 * Assign a project manager to a project
 */
export const assignProjectManager = async (
  projectId: string,
  userId: string
): Promise<boolean> => {
  try {
    // First, get the project manager role ID
    const { data: roleData, error: roleError } = await supabase
      .from('project_roles')
      .select('id, role_key')
      .eq('role_key', 'project_manager')
      .single();
    
    if (roleError || !roleData) {
      console.error('Error fetching project manager role:', roleError);
      return false;
    }
    
    // Get project manager role ID
    const projectManagerRoleId = roleData.id;
    
    // Now, assign the user to this role
    const { error } = await supabase
      .from('user_project_roles')
      .upsert({
        user_id: userId,
        project_id: projectId,
        project_role_id: projectManagerRoleId
      });
    
    if (error) {
      console.error('Error assigning project manager role:', error);
      return false;
    }
    
    // Update the project record to indicate the project manager
    const { error: updateError } = await supabase
      .from('projects')
      .update({ project_manager_id: userId })
      .eq('id', projectId);
    
    if (updateError) {
      console.error('Error updating project manager in project:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in assignProjectManager:', error);
    return false;
  }
};

/**
 * Get the current project manager for a project
 */
export const getProjectManager = async (projectId: string): Promise<TeamMember | null> => {
  try {
    // Get the project manager ID from the projects table
    const { data: project, error } = await supabase
      .from('projects')
      .select('project_manager_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (error || !project || !project.project_manager_id) {
      console.log('No project manager assigned yet:', error || 'No project manager ID found');
      return null;
    }
    
    // Get the user details
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', project.project_manager_id)
      .maybeSingle();
    
    if (userError || !userData) {
      console.error('Error fetching project manager details:', userError);
      return null;
    }
    
    return {
      id: userData.id,
      name: userData.full_name || 'Project Manager',
      role: 'Project Manager',
      user_id: userData.id
    };
  } catch (error) {
    console.error('Exception in getProjectManager:', error);
    return null;
  }
};

/**
 * Get project manager name for display
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string> => {
  try {
    const manager = await getProjectManager(projectId);
    return manager ? manager.name : 'Not Assigned';
  } catch (error) {
    console.error('Error fetching project manager name:', error);
    return 'Not Assigned';
  }
};

/**
 * Check if a user is the project manager
 */
export const isUserProjectManager = async (
  userId: string,
  projectId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('project_manager_id')
      .eq('id', projectId)
      .eq('project_manager_id', userId)
      .maybeSingle();
    
    return !error && !!data;
  } catch (error) {
    console.error('Error checking if user is project manager:', error);
    return false;
  }
};

/**
 * Find project manager details by project ID
 */
export const findProjectManager = getProjectManager; // Alias for compatibility
