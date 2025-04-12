
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { getUserProjectRole } from './permissions';

/**
 * Fetches the project manager for a project
 */
export const findProjectManager = async (projectId: string): Promise<TeamMember | null> => {
  try {
    // First check the projects table for project_manager_id
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('project_manager_id, project_manager_name')
      .eq('id', projectId)
      .maybeSingle();

    if (projectError) {
      console.error('Error fetching project manager from projects table:', projectError);
      return null;
    }

    // If we have a project manager in the projects table, use that information
    if (projectData?.project_manager_id) {
      // Check if this user is in the team
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('id, project_member_name')
        .eq('project_id', projectId)
        .eq('user_id', projectData.project_manager_id)
        .maybeSingle();

      if (!memberError && memberData) {
        return {
          id: memberData.id,
          user_id: projectData.project_manager_id,
          name: memberData.project_member_name || projectData.project_manager_name || 'Project Manager',
          role: 'project_manager'
        };
      }
    }

    // If no project manager in projects table or not found in team,
    // look for team members with project_manager role
    const { data: members, error: membersError } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name')
      .eq('project_id', projectId);

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return null;
    }

    // No members found
    if (!members || members.length === 0) {
      return null;
    }

    // Check each member's role to find a project manager
    for (const member of members) {
      if (!member.user_id) continue;
      
      const role = await getUserProjectRole(member.user_id, projectId);
      
      if (role === 'project_manager') {
        return {
          id: member.id,
          user_id: member.user_id,
          name: member.project_member_name || 'Project Manager',
          role: 'project_manager'
        };
      }
    }

    // If no project manager found, return the first member as a fallback
    return {
      id: members[0].id,
      user_id: members[0].user_id,
      name: members[0].project_member_name || 'Team Member',
      role: 'team_member'
    };
  } catch (error) {
    console.error('Exception in findProjectManager:', error);
    return null;
  }
};

/**
 * Fetches the name of the project manager for a project
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string> => {
  const manager = await findProjectManager(projectId);
  return manager?.name || 'No Manager';
};

/**
 * Checks if a user is the project manager
 */
export const isUserProjectManager = async (userId: string, projectId: string): Promise<boolean> => {
  const role = await getUserProjectRole(userId, projectId);
  return role === 'project_manager';
};
