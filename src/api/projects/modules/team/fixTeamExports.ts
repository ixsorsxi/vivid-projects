
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
      'get_project_team_with_permissions' as any,
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format returned from RPC:', data);
      return [];
    }
    
    // Explicitly cast and transform the data to match the expected type
    const membersWithPermissions = data as unknown as Array<{
      id: string;
      name: string;
      role: string;
      user_id: string;
      permissions: string[];
      role_description?: string;
    }>;

    // Return the properly typed data
    return membersWithPermissions.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      user_id: member.user_id,
      permissions: member.permissions || [],
      role_description: member.role_description
    }));
  } catch (error) {
    console.error('Error in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};
