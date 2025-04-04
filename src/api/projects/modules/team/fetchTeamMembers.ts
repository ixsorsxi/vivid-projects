
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/projects/team/types';

/**
 * Fetches team members for a project
 */
export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);

    // Fetch project members directly from the project_members table
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name, role')
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching project members:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No team members found for project:', projectId);
      return [];
    }

    // Map the database records to TeamMember objects
    const teamMembers: TeamMember[] = data.map(record => ({
      id: record.id,
      name: record.project_member_name || 'Unknown User',
      role: record.role || 'Team Member',
      user_id: record.user_id || undefined
    }));

    console.log('Fetched team members:', teamMembers);
    return teamMembers;
  } catch (error) {
    console.error('Exception in fetchProjectTeamMembers:', error);
    return [];
  }
};

/**
 * Fetches the project manager's name
 */
export const fetchTeamManagerName = async (projectId: string): Promise<string | null> => {
  try {
    // First, check if the project has a project_manager_name field
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('project_manager_name, project_manager_id')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Error fetching project manager from projects table:', projectError);
      return null;
    }

    // If project_manager_name is available, use it
    if (projectData?.project_manager_name) {
      return projectData.project_manager_name;
    }

    // If not, check for a team member with "Project Manager" role
    const { data: managerData, error: managerError } = await supabase
      .from('project_members')
      .select('project_member_name')
      .eq('project_id', projectId)
      .eq('role', 'Project Manager')
      .maybeSingle();

    if (managerError) {
      console.error('Error fetching project manager from members table:', managerError);
      return null;
    }

    if (managerData?.project_member_name) {
      return managerData.project_member_name;
    }

    return null;
  } catch (error) {
    console.error('Exception in fetchTeamManagerName:', error);
    return null;
  }
};
