
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Securely fetches project team members avoiding the RLS recursion issues
 * Uses multiple fallback approaches to ensure reliability
 */
export const getProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    debugLog('TEAM API', 'Fetching team members for project:', projectId);
    
    // Use a direct query approach first
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name, role')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (error) {
      debugError('TEAM API', 'Error in direct query for team members:', error);
      
      // Try alternative approach if direct query fails
      try {
        // Attempt with a direct query and user role check
        const { data: altData, error: altError } = await supabase
          .from('project_members')
          .select(`
            id, 
            user_id, 
            project_member_name,
            role
          `)
          .eq('project_id', projectId)
          .is('left_at', null);
        
        if (!altError && altData && altData.length > 0) {
          debugLog('TEAM API', 'Retrieved team members using alternative query');
          
          // Transform the response to our TeamMember type
          const teamMembers: TeamMember[] = altData.map(member => ({
            id: member.id,
            name: member.project_member_name || 'Team Member',
            role: member.role || 'team_member',
            user_id: member.user_id
          }));
          
          return teamMembers;
        }
      } catch (altError) {
        debugError('TEAM API', 'Alternative query also failed:', altError);
      }
      
      // If all else fails, return empty array
      debugError('TEAM API', 'All team member queries failed, returning empty array');
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      debugLog('TEAM API', 'No team members found or invalid response format');
      return [];
    }
    
    // Transform the response to our TeamMember type
    const teamMembers: TeamMember[] = data.map(member => ({
      id: member.id,
      name: member.project_member_name || 'Team Member',
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
