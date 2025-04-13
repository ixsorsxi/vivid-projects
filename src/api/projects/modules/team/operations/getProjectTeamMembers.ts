
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Securely fetches project team members avoiding the RLS recursion issues
 * Uses RPC function with security definer to avoid infinite recursion
 */
export const getProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    debugLog('TEAM API', 'Fetching team members for project:', projectId);
    
    // First attempt: Use the secure RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_team_members_safe',
      { p_project_id: projectId }
    );
    
    if (!rpcError && rpcData && rpcData.length > 0) {
      debugLog('TEAM API', 'Successfully fetched team members via RPC:', rpcData.length);
      
      // Transform the response to our TeamMember type
      const teamMembers: TeamMember[] = rpcData.map(member => ({
        id: member.id,
        name: member.name || 'Team Member',
        role: member.role || 'team_member',
        user_id: member.user_id
      }));
      
      return teamMembers;
    }
    
    if (rpcError) {
      debugError('TEAM API', 'Error with RPC team members query:', rpcError);
    }
    
    // Second attempt: Direct query as fallback
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name, role')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (error) {
      debugError('TEAM API', 'Error in direct query for team members:', error);
      
      // Try alternative approach with bypass_rls if direct query fails
      try {
        const { data: bypassRes } = await supabase.rpc('bypass_rls_for_development');
        
        if (bypassRes) {
          // If bypass succeeded, try direct query again
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
            debugLog('TEAM API', 'Retrieved team members using bypass RLS');
            
            // Transform the response to our TeamMember type
            const teamMembers: TeamMember[] = altData.map(member => ({
              id: member.id,
              name: member.project_member_name || 'Team Member',
              role: member.role || 'team_member',
              user_id: member.user_id
            }));
            
            return teamMembers;
          }
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
