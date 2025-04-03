
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches the name of the project manager for a specific project
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    console.log('[API] Fetching project manager for project:', projectId);
    
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
      .limit(1);
    
    if (managerError) {
      console.error('[API] Error fetching manager from team members:', managerError);
      return null;
    }
    
    return managerData && managerData.length > 0 ? managerData[0].name : null;
  } catch (error) {
    console.error('[API] Error in fetchProjectManagerName:', error);
    return null;
  }
};

/**
 * Finds a project manager from team members
 */
export const findProjectManager = (teamMembers: any[]): any | null => {
  if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
    return null;
  }
  
  return teamMembers.find(member => 
    member.role === 'Project Manager' || 
    member.role === 'project-manager' ||
    member.role === 'project manager'
  );
};
