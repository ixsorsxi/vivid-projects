
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Securely fetches project team members using a direct RPC function
 * Avoids the RLS recursion issues with project_members table
 */
export const getProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    debugLog('TEAM API', 'Fetching team members with getProjectTeamMembers for project:', projectId);
    
    // Use the get_project_team_members_safe RPC function that avoids RLS recursion
    const { data, error } = await supabase.rpc(
      'get_project_team_members_safe',
      { p_project_id: projectId }
    );
    
    if (error) {
      debugError('TEAM API', 'Error in getProjectTeamMembers:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      debugLog('TEAM API', 'No team members found or invalid response format');
      return [];
    }
    
    // Transform the response to our TeamMember type
    const teamMembers: TeamMember[] = data.map(member => ({
      id: member.id,
      name: member.name || 'Team Member',
      role: member.role || 'team_member',
      user_id: member.user_id
    }));
    
    debugLog('TEAM API', `Retrieved ${teamMembers.length} team members successfully`);
    return teamMembers;
  } catch (error) {
    debugError('TEAM API', 'Exception in getProjectTeamMembers:', error);
    return [];
  }
};
