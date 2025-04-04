
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/projects/team/types';

// Function to fetch project team members
export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);
    
    // Get current user for context
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    if (!currentUser) {
      console.error('No authenticated user found when fetching team members');
      return [];
    }
    
    // Direct query approach - most reliable
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name, role')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    console.log('Retrieved team members:', data);
    
    // Make sure to properly format the member data with correct names
    return (data || []).map(member => ({
      id: member.id,
      // Explicitly use the name from the database, not the role
      name: member.project_member_name || 'Team Member',
      role: member.role || 'Member',
      user_id: member.user_id
    }));
  } catch (error) {
    console.error('Error in fetchProjectTeamMembers:', error);
    return [];
  }
};

// Function to fetch the project manager name (separate from the above)
export const fetchTeamManagerName = async (projectId: string): Promise<string | null> => {
  try {
    // Query the projects table for the project manager details
    const { data, error } = await supabase
      .from('projects')
      .select('project_manager_id')
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error('Error fetching project manager details:', error);
      return null;
    }
    
    // If we have a project manager ID, look up their name from profiles
    if (data?.project_manager_id) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', data.project_manager_id)
        .single();
      
      if (userError) {
        console.error('Error fetching project manager profile:', userError);
        return null;
      }
      
      // Return the full name or username
      return userData?.full_name || userData?.username || null;
    }
    
    return null;
  } catch (error) {
    console.error('Exception in fetchTeamManagerName:', error);
    return null;
  }
};
