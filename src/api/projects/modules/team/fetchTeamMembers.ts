
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/projects/team/types';

/**
 * Fetches team members for a project
 * @param projectId The project ID
 * @param includeInactive Whether to include members who have left the project
 */
export const fetchProjectTeamMembers = async (
  projectId: string, 
  includeInactive: boolean = false
): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);

    // Base query
    let query = supabase
      .from('project_members')
      .select(`
        id, 
        user_id, 
        project_member_name, 
        role,
        project_role_id,
        joined_at,
        left_at,
        project_roles(id, role_key, description)
      `)
      .eq('project_id', projectId);
      
    // Filter out inactive members unless specifically requested
    if (!includeInactive) {
      query = query.is('left_at', null);
    }

    const { data, error } = await query;

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
      user_id: record.user_id || undefined,
      project_role_id: record.project_role_id || undefined,
      joined_at: record.joined_at,
      left_at: record.left_at,
      role_description: record.project_roles?.description
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
    // First, check if the project has a project manager among team members
    const { data: managerData, error: managerError } = await supabase
      .from('project_members')
      .select('project_member_name')
      .eq('project_id', projectId)
      .eq('role', 'Project Manager')
      .is('left_at', null)  // Only include active members
      .maybeSingle();

    if (!managerError && managerData?.project_member_name) {
      return managerData.project_member_name;
    }

    // If that didn't work, try checking if the project itself has project manager info
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('project_manager_id')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project manager from projects table:', projectError);
        return null;
      }

      // If we have a project manager ID, try to get their name from project_members
      if (projectData?.project_manager_id) {
        const { data: managerInfo, error: managerInfoError } = await supabase
          .from('project_members')
          .select('project_member_name')
          .eq('user_id', projectData.project_manager_id)
          .eq('project_id', projectId)
          .is('left_at', null)  // Only include active members
          .maybeSingle();

        if (!managerInfoError && managerInfo?.project_member_name) {
          return managerInfo.project_member_name;
        }
      }
    } catch (err) {
      console.error('Error checking for project manager in projects table:', err);
    }

    // If we can't find a project manager, return null
    console.log('No project manager found for project:', projectId);
    return null;
  } catch (error) {
    console.error('Exception in fetchTeamManagerName:', error);
    return null;
  }
};
