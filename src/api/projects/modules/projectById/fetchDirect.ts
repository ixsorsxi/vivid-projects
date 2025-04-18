
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';
import { fetchProjectTeamMembers } from '../team/fetchTeamMembers';
import { fetchProjectManagerName } from '../team/projectManager';

/**
 * Fetch a project by its ID directly from the projects table
 */
export const fetchProjectByIdDirect = async (projectId: string): Promise<Project | null> => {
  try {
    // Fetch the basic project data
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (error || !project) {
      console.error('Error fetching project directly:', error);
      return null;
    }
    
    // Fetch team members
    let teamMembers = [];
    try {
      teamMembers = await fetchProjectTeamMembers(projectId);
    } catch (teamError) {
      console.error('Error fetching team members, using empty array:', teamError);
      teamMembers = [];
    }
    
    // Fetch project manager name
    let managerName = 'Not Assigned';
    try {
      managerName = await fetchProjectManagerName(projectId);
    } catch (managerError) {
      console.error('Error fetching manager name:', managerError);
      managerName = 'Not Assigned';
    }
    
    // Format the project according to the Project interface
    return {
      id: project.id,
      name: project.name,
      description: project.description || '',
      progress: project.progress || 0,
      status: project.status as ProjectStatus,
      dueDate: project.due_date,
      category: project.category || '',
      members: teamMembers.map((member: any) => ({
        id: String(member.id),
        name: member.name,
        role: member.role
      })),
      project_type: project.project_type || 'Development',
      project_manager_id: project.project_manager_id,
      project_manager_name: managerName,
      start_date: project.start_date,
      estimated_cost: project.estimated_cost,
      budget_approved: project.budget_approved,
      performance_index: project.performance_index || 1.0,
      priority: project.priority || 'medium',
      team: teamMembers
    };
  } catch (error) {
    console.error('Error in fetchProjectByIdDirect:', error);
    throw error;
  }
};
