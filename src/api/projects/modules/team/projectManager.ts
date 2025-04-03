
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches the project manager name for a given project
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    console.log('Fetching project manager for project:', projectId);
    
    // First approach: check if there's a team member with Project Manager role
    const { data: teamMembers, error: teamError } = await supabase
      .from('project_members')
      .select('project_member_name, role')
      .eq('project_id', projectId)
      .or('role.eq.Project Manager,role.eq.project-manager')
      .single();
    
    if (!teamError && teamMembers?.project_member_name) {
      // Don't return the role as the name
      if (teamMembers.project_member_name !== teamMembers.role) {
        console.log('Found project manager in team members:', teamMembers.project_member_name);
        return teamMembers.project_member_name;
      } else {
        return 'Project Manager';
      }
    }
    
    // Second approach: try to find project manager from projects table if columns exist
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        console.error('Error fetching project:', projectError);
        return null;
      }
      
      // If we have a user_id, try to get their name from profiles
      if (projectData?.user_id) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', projectData.user_id)
          .single();
        
        if (userError) {
          console.error('Error fetching user profile:', userError);
          return null;
        }
        
        return userData?.full_name || userData?.username || 'Project Owner';
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
    
    // If we reach here, no project manager was found
    return null;
  } catch (error) {
    console.error('Exception in fetchProjectManagerName:', error);
    return null;
  }
};

/**
 * Finds the project manager in a list of team members
 */
export const findProjectManager = (members: { id: string | number; role: string; name: string }[]): { id: string | number; name: string } | null => {
  const manager = members.find(member => 
    member.role === 'Project Manager' || 
    member.role === 'project-manager' || 
    member.role === 'project manager'
  );
  
  return manager ? { id: manager.id, name: manager.name } : null;
};
