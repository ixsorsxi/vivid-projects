
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches the project manager name for a given project
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    console.log('Fetching project manager for project:', projectId);
    
    // First approach: check the project_manager_name column in projects table
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('project_manager_name, project_manager_id')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      console.error('Error fetching project:', projectError);
      return null;
    }
    
    // If we have a project_manager_name, return it
    if (projectData?.project_manager_name) {
      console.log('Found project manager name in projects table:', projectData.project_manager_name);
      return projectData.project_manager_name;
    }
    
    // Second approach: try to find project member with Project Manager role
    const { data: teamMembers, error: teamError } = await supabase
      .from('project_members')
      .select('name, role')
      .eq('project_id', projectId)
      .or('role.eq.Project Manager,role.eq.project-manager')
      .single();
    
    if (teamError) {
      if (teamError.code !== 'PGRST116') { // Not found error
        console.error('Error fetching project team members:', teamError);
      }
      console.log('No project manager found in project_members');
      return null;
    }
    
    if (teamMembers?.name) {
      // Don't return the role as the name
      if (teamMembers.name !== teamMembers.role) {
        console.log('Found project manager in team members:', teamMembers.name);
        return teamMembers.name;
      } else {
        return 'Project Manager';
      }
    }
    
    // If we reach here, no project manager was found
    return null;
  } catch (error) {
    console.error('Exception in fetchProjectManagerName:', error);
    return null;
  }
};

/**
 * Finds the project manager in a list of team members
 */
export const findProjectManager = (members: { id: string | number; role: string; name: string }[]): { id: string | number; name: string } | null => {
  const manager = members.find(member => 
    member.role === 'Project Manager' || 
    member.role === 'project-manager' || 
    member.role === 'project manager'
  );
  
  return manager ? { id: manager.id, name: manager.name } : null;
};
