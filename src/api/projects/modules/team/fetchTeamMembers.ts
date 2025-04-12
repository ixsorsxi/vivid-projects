
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { getUserProjectRole } from './permissions';

/**
 * Fetches team members for a project securely
 * Handles the case where the role column might not exist directly
 */
export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);
    
    // Query project_members table
    const { data, error } = await supabase
      .from('project_members')
      .select('id, project_member_name, user_id, joined_at')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('No team members found for project:', projectId);
      return [];
    }
    
    // For each member, get their role from user_project_roles table
    const membersWithRoles = await Promise.all(
      data.map(async (member) => {
        let role = 'team_member'; // Default role
        
        if (member.user_id) {
          // Try to get user's role from user_project_roles
          const userRole = await getUserProjectRole(member.user_id, projectId);
          if (userRole) {
            role = userRole;
          }
        }
        
        return {
          id: member.id,
          name: member.project_member_name || 'Unknown Member',
          role,
          user_id: member.user_id,
          joined_at: member.joined_at
        };
      })
    );
    
    console.log('Fetched team members with roles:', membersWithRoles);
    return membersWithRoles;
  } catch (error) {
    console.error('Exception in fetchProjectTeamMembers:', error);
    return [];
  }
};
