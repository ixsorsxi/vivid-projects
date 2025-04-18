
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';
import { getProjectRoleByKey } from './permissions/fetchRolesAndPermissions';

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
    
    // Cast the data to the expected structure
    const projectRole = roleData as { id: string, role_key: string };
    const projectManagerRoleId = projectRole.id;
    
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
    
    // Cast the data to the expected structure
    const profile = userData as { id: string, full_name: string };
    
    return {
      id: profile.id,
      name: profile.full_name || 'Project Manager',
      role: 'Project Manager',
      user_id: profile.id
    };
  } catch (error) {
    console.error('Exception in getProjectManager:', error);
    return null;
  }
};
