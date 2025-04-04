
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, TeamMemberWithPermissions } from './types';

/**
 * Fetch team members with their permissions for a project
 */
export const fetchTeamMembersWithPermissions = async (
  projectId: string
): Promise<TeamMemberWithPermissions[]> => {
  try {
    // Using an RPC function to get team members with permissions
    const { data, error } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};
