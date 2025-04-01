
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';
import { handleDatabaseError } from '../utils';
import { fetchProjectTeamMembers, findProjectManager, fetchProjectManagerName } from './teamMembers';

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
    
    // Process team data to ensure it's compatible with TeamMember type
    let teamMembers = [];
    if (project.team) {
      // Convert JSON team data to proper TeamMember objects
      teamMembers = Array.isArray(project.team) 
        ? project.team.map((member: any) => ({
            id: member.id || String(Date.now()),
            name: member.name || 'Team Member',
            role: member.role || 'Member',
            user_id: member.user_id
          }))
        : [];
    }
    
    // Get project manager name
    let managerName = 'Not Assigned';
    if (project.project_manager_id) {
      // First try to find in team members
      managerName = findProjectManager(teamMembers, project.project_manager_id);
      
      // If not found in team members, fetch directly
      if (managerName === 'Not Assigned') {
        managerName = await fetchProjectManagerName(projectId, project.project_manager_id);
      }
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
      members: [], // Will be populated from team data
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

/**
 * Fetch a project by its ID using direct table query
 */
export const fetchProjectByIdDirect = async (projectId: string): Promise<Project | null> => {
  // Basic project data
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select(`
      id, 
      name, 
      description, 
      progress, 
      status, 
      due_date, 
      category,
      project_type,
      project_manager_id,
      start_date,
      estimated_cost,
      actual_cost,
      budget_approved,
      performance_index
    `)
    .eq('id', projectId)
    .single();

  if (projectError) {
    console.error('Error fetching project:', projectError);
    throw handleDatabaseError(projectError);
  }

  if (!projectData) {
    console.log('No project found with ID:', projectId);
    return null;
  }

  console.log('Successfully fetched project:', projectData);

  // Fetch project team members
  const teamMembers = await fetchProjectTeamMembers(projectId);
  const validTeamMembers = teamMembers || [];

  // Get manager name
  let managerName = 'Not Assigned';
  if (projectData.project_manager_id) {
    // Check if the project manager is in the team members list
    const manager = validTeamMembers.find(m => 
      (m.user_id && m.user_id === projectData.project_manager_id) || 
      m.id === projectData.project_manager_id
    );
    
    if (manager && manager.name) {
      managerName = manager.name;
    } else {
      // Try to fetch directly if not found in team members
      managerName = await fetchProjectManagerName(projectId, projectData.project_manager_id);
    }
  }

  console.log('Project category from database:', projectData.category);
  console.log('Project manager:', managerName);
  console.log('Team members count:', validTeamMembers.length);

  // Transform database record to Project type
  return {
    id: projectData.id,
    name: projectData.name || '', 
    description: projectData.description || '',
    progress: projectData.progress || 0,
    status: projectData.status as ProjectStatus,
    dueDate: projectData.due_date || '',
    category: projectData.category || '',
    members: validTeamMembers.map(t => ({ 
      id: t.user_id, 
      name: t.name || 'Unnamed', 
      role: t.role || 'Member' 
    })) || [],
    team: validTeamMembers,
    project_type: projectData.project_type || 'Development',
    project_manager_id: projectData.project_manager_id || null,
    project_manager_name: managerName,
    start_date: projectData.start_date || '',
    estimated_cost: projectData.estimated_cost || 0,
    actual_cost: projectData.actual_cost || 0,
    budget_approved: projectData.budget_approved || false,
    performance_index: projectData.performance_index || 1.0
  };
};
