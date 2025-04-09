import { TeamMember } from './types';
import { fetchProjectTeamMembers } from './fetchTeamMembers';
import { fetchPermissionsForRole } from './rolePermissions';

/**
 * Fetches team members with their permissions
 */
export const fetchTeamMembersWithPermissions = async (projectId: string) => {
  const members = await fetchProjectTeamMembers(projectId);
  
  // This is a placeholder - would need to actually fetch permissions
  // based on member roles in a real implementation
  return members.map(member => ({
    ...member,
    permissions: ['view_project', 'view_tasks']
  }));
};
