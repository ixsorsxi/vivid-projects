
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, TeamMemberWithPermissions } from '@/components/projects/team/types';

/**
 * Fetches team members with their permissions
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMemberWithPermissions[]> => {
  try {
    console.log('Fetching team members with permissions for project:', projectId);
    
    // First try to use the security definer function
    const { data, error } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      return [];
    }
    
    return (data || []).map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      user_id: member.user_id,
      permissions: member.permissions || []
    }));
  } catch (error) {
    console.error('Exception in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};
