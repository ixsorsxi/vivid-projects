
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';
import { fetchProjectTeamMembers } from '../team/fetchTeamMembers';
import { fetchProjectManagerName } from '../team/projectManager';
import { handleDatabaseError } from '../../utils';

/**
 * Fetch a project by its ID using RPC function
 */
export const fetchProjectByIdRPC = async (projectId: string): Promise<Project | null> => {
  try {
    const { data: projectData, error: rpcError } = await supabase
      .rpc('get_project_by_id', { p_project_id: projectId });

    if (rpcError) {
      console.error('Error fetching project with RPC:', rpcError);
      throw handleDatabaseError(rpcError);
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
    
    // Extract team members directly from the RPC response if available
    let teamMembers = [];
    
    if (project.team_data && Array.isArray(project.team_data)) {
      teamMembers = project.team_data.map((member: any) => ({
        id: member.id || String(Date.now()),
        name: member.name || member.role || 'Team Member', // Try to use name if available
        role: member.role || 'Member',
        user_id: member.user_id
      }));
      console.log('Fetched team members directly from RPC:', teamMembers);
    } else {
      // If team members not in the RPC response, fetch separately
      try {
        teamMembers = await fetchProjectTeamMembers(projectId);
        console.log('Fetched team members via API call:', teamMembers);
      } catch (teamError) {
        console.error('Error fetching team members, using empty array:', teamError);
        teamMembers = [];
      }
    }
    
    // Get project manager name - always fetch directly to ensure we get the latest data
    let managerName = 'Not Assigned';
    try {
      managerName = await fetchProjectManagerName(projectId);
      console.log('Project manager name:', managerName);
    } catch (managerError) {
      console.error('Error fetching manager name:', managerError);
      managerName = 'Not Assigned';
    }
    
    // Transform the returned data to Project type
    return {
      id: project.id,
      name: project.name || '', 
      description: project.description || '',
      progress: project.progress || 0,
      status: project.status as ProjectStatus,
      dueDate: project.due_date || '',
      category: project.category || '',
      members: teamMembers.map((t: any) => ({ 
        id: String(t.id), // Convert id to string explicitly
        name: t.name,
        role: t.role  // Include role
      })),
      project_type: project.project_type || 'Development',
      project_manager_id: project.project_manager_id || null,
      project_manager_name: managerName,
      start_date: project.start_date || '',
      estimated_cost: project.estimated_cost || 0,
      budget_approved: project.budget_approved || false,
      performance_index: project.performance_index || 1.0,
      priority: project.priority || 'medium',
      team: teamMembers
    };
  } catch (error) {
    console.error('Error in fetchProjectByIdRPC:', error);
    throw error;
  }
};
