
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { toast } from '@/components/ui/toast-wrapper';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Fetches team members with their permissions for a project
 * Uses a direct query approach to avoid RLS recursion issues
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    debugLog('TEAM-PERMISSIONS', 'Fetching team members with permissions for project:', projectId);
    
    // Check if user has access to this project
    const { data: hasAccess, error: accessError } = await supabase.rpc(
      'has_project_access',
      { p_project_id: projectId }
    );
    
    if (accessError || !hasAccess) {
      debugError('TEAM-PERMISSIONS', 'Access check failed:', accessError);
      return [];
    }
    
    // Fetch team members using direct query to avoid recursion
    const { data: memberData, error: memberError } = await supabase
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
    
    if (memberError) {
      debugError('TEAM-PERMISSIONS', 'Error in direct query:', memberError);
      throw memberError;
    }
    
    // Map to the expected format
    const teamMembers: TeamMember[] = (memberData || []).map(member => ({
      id: member.id,
      name: member.project_member_name || 'Unknown Member',
      role: member.role || 'team_member',
      user_id: member.user_id,
      joined_at: member.joined_at,
      permissions: [] // We don't have permissions in this fallback method
    }));
    
    debugLog('TEAM-PERMISSIONS', 'Fetched team members:', teamMembers);
    return teamMembers;
  } catch (error) {
    debugError('TEAM-PERMISSIONS', 'Exception in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};

/**
 * Safely check if the current user can access a specific project
 */
export const checkProjectAccess = async (projectId: string): Promise<boolean> => {
  if (!projectId) return false;
  
  try {
    debugLog('TEAM-PERMISSIONS', 'Checking project access for:', projectId);
    
    const { data, error } = await supabase.rpc(
      'has_project_access',
      { p_project_id: projectId }
    );
    
    if (error) {
      debugError('TEAM-PERMISSIONS', 'Error checking project access:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    debugError('TEAM-PERMISSIONS', 'Exception checking project access:', err);
    return false;
  }
};
