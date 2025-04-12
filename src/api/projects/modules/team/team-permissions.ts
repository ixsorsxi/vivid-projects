
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchProjectTeamMembers } from './fetchTeamMembers';

/**
 * Fetches team members with their permissions for a project
 * Uses the new non-recursive function to avoid RLS issues
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members with permissions for project:', projectId);
    
    // Try to use the new v2 function first
    const { data: teamData, error: rpcError } = await supabase.rpc(
      'get_project_members_v2',
      { p_project_id: projectId }
    );
    
    if (!rpcError && teamData) {
      console.log('Successfully fetched team members using get_project_members_v2:', teamData);
      
      // Transform to TeamMember format
      return teamData.map(member => ({
        id: member.id,
        name: member.project_member_name || 'Unknown Member',
        role: member.role || 'team_member',
        user_id: member.user_id,
        permissions: [] // We don't have permissions in the v2 function result
      }));
    }
    
    console.log('Falling back to get_project_team_with_permissions');
    
    // If v2 function fails, try the original get_project_team_with_permissions
    const { data: originalTeamData, error } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      
      // Fall back to direct query if RPC fails
      return await fetchProjectTeamMembers(projectId);
    }
    
    // Format the team data
    return (originalTeamData || []).map(member => ({
      id: member.id,
      name: member.name || 'Unknown Member',
      role: member.role || 'team_member',
      user_id: member.user_id,
      permissions: member.permissions || []
    }));
  } catch (error) {
    console.error('Exception in fetchTeamMembersWithPermissions:', error);
    toast.error('Failed to load team members', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    return [];
  }
};

/**
 * Safely check if the current user can access a specific project
 * Uses the new v2 function to avoid RLS recursion issues
 */
export const checkProjectAccess = async (projectId: string): Promise<boolean> => {
  if (!projectId) return false;
  
  try {
    // Use the new v2 function to check access without recursion
    const { data, error } = await supabase.rpc(
      'check_project_access_v2',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error checking project access:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Exception checking project access:', err);
    return false;
  }
};
