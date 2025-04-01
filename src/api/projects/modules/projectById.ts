
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
    
    // Fetch team members directly to ensure correct data
    const teamMembers = await fetchProjectTeamMembers(projectId);
    console.log('Fetched team members directly:', teamMembers);
    
    // Get project manager name
    let managerName = 'Not Assigned';
    
    // First try finding project manager by role in team members
    const projectManager = teamMembers.find(m => 
      m.role && m.role.toLowerCase().includes('manager')
    );
    
    if (projectManager) {
      managerName = projectManager.name;
      console.log('Found project manager by role:', managerName);
    }
    // Then check by project_manager_id if exists
    else if (project.project_manager_id) {
      managerName = findProjectManager(teamMembers, project.project_manager_id);
      console.log('Found project manager by ID:', managerName);
      
      // If not found in team members, fetch directly
      if (managerName === 'Not Assigned') {
        managerName = await fetchProjectManagerName(projectId, project.project_manager_id);
        console.log('Fetched manager name directly:', managerName);
      }
    }
    // If still not found, try to fetch any team member with manager role
    else if (teamMembers.length > 0) {
      managerName = await fetchProjectManagerName(projectId, "");
      console.log('Fetched first available team member as manager:', managerName);
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
  console.log('Fetched team members:', teamMembers);

  // Get manager name
  let managerName = 'Not Assigned';
  
  // First try finding project manager by role in team members
  const projectManager = teamMembers.find(m => 
    m.role && m.role.toLowerCase().includes('manager')
  );
  
  if (projectManager) {
    managerName = projectManager.name;
    console.log('Found project manager by role:', managerName);
  }
  // Then check by project_manager_id if exists
  else if (projectData.project_manager_id) {
    managerName = findProjectManager(teamMembers, projectData.project_manager_id);
    console.log('Found project manager by ID:', managerName);
    
    // If not found in team members, fetch directly
    if (managerName === 'Not Assigned') {
      managerName = await fetchProjectManagerName(projectId, projectData.project_manager_id);
      console.log('Fetched manager name directly:', managerName);
    }
  }
  // If still not found, try to fetch any team member as a manager
  else if (teamMembers.length > 0) {
    managerName = await fetchProjectManagerName(projectId, "");
    console.log('Fetched first available team member as manager:', managerName);
  }

  // Transform database record to Project type
  return {
    id: projectData.id,
    name: projectData.name || '', 
    description: projectData.description || '',
    progress: projectData.progress || 0,
    status: projectData.status as ProjectStatus,
    dueDate: projectData.due_date || '',
    category: projectData.category || '',
    members: teamMembers.map(t => ({ 
      id: String(t.id), // Convert id to string explicitly
      name: t.name,
      role: t.role  // Include role
    })),
    team: teamMembers,
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
