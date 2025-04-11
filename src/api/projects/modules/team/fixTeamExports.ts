
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';

/**
 * Gets team members with their permissions using the new structure
 */
export const fetchTeamMembersWithPermissions = async (
  projectId: string
): Promise<TeamMember[]> => {
  try {
    // First get the team members
    const { data: members, error: membersError } = await supabase
      .from('project_members')
      .select('id, project_member_name, user_id')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (membersError) {
      console.error('Error fetching team members:', membersError);
      return [];
    }
    
    // For each member, get their role from user_project_roles
    const teamMembers: TeamMember[] = [];
    
    for (const member of members || []) {
      if (!member.user_id) continue;
      
      // Get the user's role for this project
      const { data: roleData, error: roleError } = await supabase
        .from('user_project_roles')
        .select('project_roles(role_key)')
        .eq('project_id', projectId)
        .eq('user_id', member.user_id)
        .maybeSingle();
      
      // Get the user's permissions for this project
      const { data: permissionsData, error: permissionsError } = await supabase.rpc(
        'get_user_project_permissions',
        { 
          p_user_id: member.user_id, 
          p_project_id: projectId 
        }
      );
      
      // Extract the permission_name values from the returned objects
      const permissions = permissionsError ? [] : 
        permissionsData.map((item: { permission_name: string }) => item.permission_name);
      
      teamMembers.push({
        id: member.id,
        name: member.project_member_name || 'Team Member',
        role: roleData?.project_roles?.role_key || 'team_member',
        user_id: member.user_id,
        permissions: permissions
      });
    }
    
    return teamMembers;
  } catch (error) {
    console.error('Error in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};
