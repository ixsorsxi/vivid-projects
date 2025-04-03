
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/projects/team/types';

/**
 * Fetches all team members for a specific project
 */
export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('[API] Fetching team members for project:', projectId);
    
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name, role')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('[API] Error fetching project team members:', error);
      return [];
    }
    
    console.log('[API] Fetched team members:', data);
    
    return (data || []).map(member => ({
      id: member.id,
      name: member.project_member_name || 'Team Member',
      role: member.role || 'Member',
      user_id: member.user_id
    }));
  } catch (error) {
    console.error('[API] Error in fetchProjectTeamMembers:', error);
    return [];
  }
};

/**
 * Fetches the name of the team manager
 */
export const fetchTeamManagerName = async (projectId: string): Promise<string | null> => {
  try {
    // Look for team members with the Project Manager role
    const { data: managerData, error: managerError } = await supabase
      .from('project_members')
      .select('project_member_name')
      .eq('project_id', projectId)
      .eq('role', 'Project Manager')
      .single();
    
    if (!managerError && managerData?.project_member_name) {
      return managerData.project_member_name;
    }
    
    // If no dedicated manager found, fallback to checking project owner
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        console.error('[API] Error fetching project:', projectError);
        return null;
      }
      
      // If we have a user_id, try to get their name from profiles
      if (projectData?.user_id) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', projectData.user_id)
          .single();
        
        if (!userError) {
          return userData?.full_name || userData?.username || 'Project Owner';
        }
      }
    } catch (error) {
      console.error('[API] Error fetching project data:', error);
    }
    
    return null;
  } catch (error) {
    console.error('[API] Error in fetchTeamManagerName:', error);
    return null;
  }
};
