
import { supabase } from '@/integrations/supabase/client';

/**
 * Find the project manager from the team members
 */
export const findProjectManager = (teamMembers: any[]): any | null => {
  if (!teamMembers || teamMembers.length === 0) return null;
  
  return teamMembers.find(member => {
    const role = member.role ? member.role.toLowerCase() : '';
    return role === 'project manager' || role === 'manager';
  });
};

/**
 * Fetch the name of the project manager for a project
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    // First try to get the project to find the project_manager_id
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('project_manager_id')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project || !project.project_manager_id) {
      // If no project_manager_id, look for a team member with project manager role
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select('name, role')
        .eq('project_id', projectId);
        
      if (membersError || !members || members.length === 0) {
        return null;
      }
      
      const projectManager = members.find(member => 
        member.role?.toLowerCase() === 'project manager' || 
        member.role?.toLowerCase() === 'manager'
      );
      
      return projectManager ? projectManager.name : null;
    }
    
    // If project_manager_id exists, get the user's name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', project.project_manager_id)
      .single();
      
    if (profileError || !profile) {
      return null;
    }
    
    return profile.full_name;
  } catch (error) {
    console.error('Error fetching project manager name:', error);
    return null;
  }
};
