
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
    
    // Check if user has access to this project using direct checks to avoid RLS issues
    const { data: projectExists, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      debugError('TEAM-PERMISSIONS', 'Error checking project existence:', projectError);
      return [];
    }
    
    // Fetch team members directly from the project_members table
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
    
    // Check if user is project owner (direct query)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      debugError('TEAM-PERMISSIONS', 'Error getting current user:', userError);
      return false;
    }
    
    const userId = userData.user.id;
    
    // Check if user is project owner
    const { data: isOwner, error: ownerError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (isOwner) {
      return true;
    }
    
    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (isAdmin) {
      return true;
    }
    
    // Check if user is team member
    const { data: isMember, error: memberError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .is('left_at', null)
      .maybeSingle();
    
    return !!isMember;
  } catch (err) {
    debugError('TEAM-PERMISSIONS', 'Exception checking project access:', err);
    return false;
  }
};
