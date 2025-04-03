
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
      .select('id, user_id, name, role')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('[API] Error fetching project team members:', error);
      return [];
    }
    
    console.log('[API] Fetched team members:', data);
    
    return (data || []).map(member => ({
      id: member.id,
      name: member.name || 'Team Member',
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
    // First check the project table for a manager
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('project_manager_name, project_manager_id')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      console.error('[API] Error fetching project manager from project:', projectError);
      return null;
    }
    
    // If we have a project manager name, return it
    if (projectData?.project_manager_name) {
      return projectData.project_manager_name;
    }
    
    // If we have a manager ID but no name, try to get the name from the profiles table
    if (projectData?.project_manager_id) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', projectData.project_manager_id)
        .single();
      
      if (userError) {
        console.error('[API] Error fetching manager profile:', userError);
        return null;
      }
      
      return userData?.full_name || userData?.username || null;
    }
    
    // If we don't have a project manager name or ID, look for team members with the Project Manager role
    const { data: managerData, error: managerError } = await supabase
      .from('project_members')
      .select('name')
      .eq('project_id', projectId)
      .eq('role', 'Project Manager')
      .single();
    
    if (managerError && managerError.code !== 'PGRST116') { // Ignore not found error
      console.error('[API] Error fetching manager from team members:', managerError);
      return null;
    }
    
    return managerData?.name || null;
  } catch (error) {
    console.error('[API] Error in fetchTeamManagerName:', error);
    return null;
  }
};
