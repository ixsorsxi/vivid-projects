
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';

/**
 * Fetches team members with their permissions using a security definer function
 * This avoids the recursive RLS policy issue
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // Call the RPC function that uses SECURITY DEFINER to bypass RLS
    const { data, error } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    // Transform data to match TeamMember type
    return data.map((member: any) => ({
      id: member.id,
      name: member.name || 'Team Member',
      role: member.role || 'team_member',
      user_id: member.user_id,
      permissions: member.permissions
    }));
  } catch (error) {
    console.error('Exception in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};
