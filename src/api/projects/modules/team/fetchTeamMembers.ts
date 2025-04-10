
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { getUserProjectRole } from './rolePermissions';

/**
 * Fetches team members for a project
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
        joined_at,
        left_at`);
      
    query = query.eq('project_id', projectId);

    // Filter out inactive members if not requested
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
    const teamMembers: TeamMember[] = await Promise.all(
      data.map(async record => {
        // If we have a user_id, fetch their role from user_project_roles
        let role = 'team_member'; // Default role
        if (record.user_id) {
          const userRole = await getUserProjectRole(record.user_id, projectId);
          if (userRole) {
            role = userRole;
          }
        }

        return {
          id: record.id,
          name: record.project_member_name || 'Unknown User',
          role: role,
          user_id: record.user_id || undefined,
          joined_at: record.joined_at || undefined,
          left_at: record.left_at || undefined
        };
      })
    );

    console.log('Fetched team members:', teamMembers);
    return teamMembers;
  } catch (error) {
    console.error('Exception in fetchProjectTeamMembers:', error);
    return [];
  }
};
