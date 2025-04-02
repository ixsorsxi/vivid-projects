
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';
import { fetchProjectTeamMembers, fetchProjectManagerName } from '../team';

/**
 * Fetch a project by its ID using RPC function
 */
export const fetchProjectByIdRPC = async (projectId: string): Promise<Project | null> => {
  try {
    const { data: projectData, error: rpcError } = await supabase
      .rpc('get_project_by_id', { p_project_id: projectId });

    if (rpcError) {
      console.error('Error fetching project with RPC:', rpcError);
      throw rpcError;
    }

    if (!projectData) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    console.log('Successfully fetched project via RPC:', projectData);
    
    // The RPC returns a single row object, not an array
    const project = Array.isArray(projectData) ? projectData[0] : projectData;
    
    if (!project) {
      return null;
    }
    
    // Fetch team members directly to ensure correct data
    const teamMembers = await fetchProjectTeamMembers(projectId);
    console.log('Fetched team members directly:', teamMembers);
    
    // Get project manager name - always fetch directly to ensure we get the latest data
    let managerName = await fetchProjectManagerName(projectId, project.project_manager_id || "");
    console.log('Project manager name:', managerName);
    
    // Transform the returned data to Project type
    return {
      id: project.id,
      name: project.name || '', 
      description: project.description || '',
      progress: project.progress || 0,
      status: project.status as ProjectStatus,
      dueDate: project.due_date || '',
      category: project.category || '',
      members: teamMembers.map(t => ({ 
        id: String(t.id), // Convert id to string explicitly
        name: t.name,
        role: t.role  // Include role
      })),
      team: teamMembers,
      project_type: project.project_type || 'Development',
      project_manager_id: project.project_manager_id || null,
      project_manager_name: managerName,
      start_date: project.start_date || '',
      estimated_cost: project.estimated_cost || 0,
      actual_cost: project.actual_cost || 0,
      budget_approved: project.budget_approved || false,
      performance_index: project.performance_index || 1.0
    };
  } catch (error) {
    console.error('Error in fetchProjectByIdRPC:', error);
    throw error;
  }
};
