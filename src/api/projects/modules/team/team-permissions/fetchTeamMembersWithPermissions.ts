
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';
import { fetchUserProjectPermissions, ProjectRoleKey, getUserProjectRole } from '../permissions';

/**
 * Fetches all team members for a project with their roles
 */
export const fetchAllTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // Get all members of this project
    const { data: members, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (error) {
      console.error('Error fetching project members:', error);
      return [];
    }
    
    if (!members || members.length === 0) {
      return [];
    }
    
    // For each member, get their role
    const teamMembers = await Promise.all(members.map(async (member) => {
      let role: ProjectRoleKey = 'team_member';
      
      if (member.user_id) {
        const userRole = await getUserProjectRole(member.user_id, projectId);
        if (userRole) {
          role = userRole;
        }
      }
      
      return {
        id: member.id,
        name: member.project_member_name || 'Team Member',
        role,
        user_id: member.user_id
      };
    }));
    
    return teamMembers;
  } catch (error) {
    console.error('Exception in fetchAllTeamMembers:', error);
    return [];
  }
};

/**
 * Fetches team members with their permissions
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    const teamMembers = await fetchAllTeamMembers(projectId);
    
    // For each member with a user_id, fetch their permissions
    const membersWithPermissions = await Promise.all(
      teamMembers.map(async (member) => {
        if (member.user_id) {
          // This returns an array of permission names
          const permissions = await fetchUserProjectPermissions(member.user_id, projectId);
          
          // Convert permissions to strings if needed
          const stringPermissions = Array.isArray(permissions) 
            ? permissions.map(p => typeof p === 'string' ? p : p.toString())
            : [];
          
          return { ...member, permissions: stringPermissions };
        }
        return { ...member, permissions: [] };
      })
    );
    
    return membersWithPermissions;
  } catch (error) {
    console.error('Exception in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};
