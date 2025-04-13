
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';

/**
 * Fetches team members for a project securely
 * Now uses the direct role column added to project_members
 */
export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);
    
    // Query project_members table with the direct role column
    const { data, error } = await supabase
      .from('project_members')
      .select('id, project_member_name, user_id, role, joined_at')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('No team members found for project:', projectId);
      return [];
    }
    
    // Map the data to TeamMember type
    const teamMembers: TeamMember[] = data.map(member => ({
      id: member.id,
      name: member.project_member_name || 'Unknown Member',
      role: member.role || 'team_member', // Use direct role value
      user_id: member.user_id,
      joined_at: member.joined_at
    }));
    
    console.log('Fetched team members with roles:', teamMembers);
    return teamMembers;
  } catch (error) {
    console.error('Exception in fetchProjectTeamMembers:', error);
    return [];
  }
};
