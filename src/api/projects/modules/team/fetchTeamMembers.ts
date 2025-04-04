
import { supabase } from '@/integrations/supabase/client';

// Function to fetch the project manager name
export const fetchTeamManagerName = async (projectId: string): Promise<string | null> => {
  try {
    // Query the projects table for the project manager details
    const { data, error } = await supabase
      .from('projects')
      .select('project_manager_id, project_manager_name')
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error('Error fetching project manager name:', error);
      return null;
    }
    
    // If we have a project manager name directly, use it
    if (data?.project_manager_name) {
      return data.project_manager_name;
    }
    
    // If we have a project manager ID but no name, look up their name from profiles
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
    console.error('Exception in fetchProjectManagerName:', error);
    return null;
  }
};
