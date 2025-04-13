
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchProjectTeamMembers } from './fetchTeamMembers';

/**
 * Fetches team members with their permissions for a project
 * Uses the direct role column in project_members
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members with permissions for project:', projectId);
    
    // Check access first using standardized function
    const { data: accessData, error: accessError } = await supabase.rpc(
      'can_access_project',
      { p_project_id: projectId }
    );
    
    if (accessError || !accessData) {
      console.error('Access check failed:', accessError);
      return [];
    }
    
    // Query using the direct role column
    const { data: teamData, error } = await supabase
      .from('project_members')
      .select(`
        id, 
        project_member_name, 
        user_id,
        role,
        joined_at
      `)
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      return await fetchProjectTeamMembers(projectId);
    }
    
    // For each member, fetch their permissions
    const membersWithPermissions = await Promise.all((teamData || []).map(async member => {
      // Get permissions for this role
      const { data: permissionsData, error: permError } = await supabase.rpc(
        'get_permissions_for_role',
        { p_role_key: member.role || 'team_member' }
      );
      
      const permissions = permError ? [] : 
        (permissionsData || []).map((p: any) => p.permission_name);
      
      return {
        id: member.id,
        name: member.project_member_name || 'Unknown Member',
        role: member.role || 'team_member',
        user_id: member.user_id,
        joined_at: member.joined_at,
        permissions
      };
    }));
    
    return membersWithPermissions;
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
 * Uses the standardized can_access_project function
 */
export const checkProjectAccess = async (projectId: string): Promise<boolean> => {
  if (!projectId) return false;
  
  try {
    const { data, error } = await supabase.rpc(
      'can_access_project',
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
