
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, TeamMemberWithPermissions } from './types';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Fetches team members with their permissions for a project
 * Uses a specialized RPC function to avoid RLS recursion issues
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members with permissions for project:', projectId);
    
    // Try to use the get_project_team_with_permissions RPC function which is optimized to avoid RLS issues
    const { data: teamData, error } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      
      // Fall back to direct query if RPC fails
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('project_members')
        .select('id, project_member_name, role, user_id, joined_at, left_at')
        .eq('project_id', projectId)
        .is('left_at', null);
      
      if (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        throw new Error(`Failed to fetch team members: ${fallbackError.message}`);
      }
      
      // Map the fallback data to the expected format
      return (fallbackData || []).map(member => ({
        id: member.id,
        name: member.project_member_name || 'Unknown Member',
        role: member.role || 'team_member',
        user_id: member.user_id,
        joined_at: member.joined_at,
        permissions: []
      }));
    }
    
    // Format the team data
    return (teamData || []).map(member => ({
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
 * This is designed to avoid RLS recursion issues
 */
export const checkProjectAccess = async (projectId: string): Promise<boolean> => {
  if (!projectId) return false;
  
  try {
    // Use the safe RPC function to check access without recursion
    const { data, error } = await supabase.rpc(
      'check_project_member_access_safe',
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
