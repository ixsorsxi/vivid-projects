
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { toast } from '@/components/ui/toast-wrapper';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Fetches team members with their permissions for a project
 * Uses the direct role column in project_members
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    debugLog('TEAM-PERMISSIONS', 'Fetching team members with permissions for project:', projectId);
    
    // Check access first using direct project access function
    const { data: accessData, error: accessError } = await supabase.rpc(
      'direct_project_access',
      { p_project_id: projectId }
    );
    
    if (accessError || !accessData) {
      debugError('TEAM-PERMISSIONS', 'Access check failed:', accessError);
      return [];
    }
    
    // Try to use the get_project_team_with_permissions RPC function
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'get_project_team_with_permissions',
        { p_project_id: projectId }
      );
      
      if (!rpcError && rpcData) {
        debugLog('TEAM-PERMISSIONS', 'Successfully fetched team via RPC:', rpcData);
        return rpcData;
      }
      
      if (rpcError) {
        debugError('TEAM-PERMISSIONS', 'RPC error, trying fallback:', rpcError);
      }
    } catch (rpcErr) {
      debugError('TEAM-PERMISSIONS', 'Exception in RPC call:', rpcErr);
    }
    
    // Fallback: Direct query with special bypass
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
    
    debugLog('TEAM-PERMISSIONS', 'Fetched team members with fallback:', teamMembers);
    return teamMembers;
  } catch (error) {
    debugError('TEAM-PERMISSIONS', 'Exception in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};

/**
 * Safely check if the current user can access a specific project
 * Uses the direct_project_access function to avoid RLS recursion
 */
export const checkProjectAccess = async (projectId: string): Promise<boolean> => {
  if (!projectId) return false;
  
  try {
    debugLog('TEAM-PERMISSIONS', 'Checking project access for:', projectId);
    
    const { data, error } = await supabase.rpc(
      'direct_project_access',
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
