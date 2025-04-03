
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';
import { handleDatabaseError } from '../../utils';
import { fetchProjectTeamMembers } from '../team/fetchTeamMembers';
import { fetchProjectManagerName } from '../team/projectManager';

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

  // Get manager name - always fetch directly to ensure we get the latest data
  let managerName = await fetchProjectManagerName(projectId);
  console.log('Project manager name:', managerName);

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
    project_manager_name: managerName || '',
    start_date: projectData.start_date || '',
    estimated_cost: projectData.estimated_cost || 0,
    actual_cost: projectData.actual_cost || 0,
    budget_approved: projectData.budget_approved || false,
    performance_index: projectData.performance_index || 1.0
  };
};
