
import { supabase } from '@/integrations/supabase/client';

// Function to find a project's manager among team members
export const findProjectManager = async (projectId: string): Promise<{ id: string; name: string } | null> => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select('id, project_member_name, role')
      .eq('project_id', projectId)
      .eq('role', 'Project Manager');
    
    if (error) {
      console.error('Error finding project manager:', error);
      return null;
    }
    
    // Return the first project manager found
    if (data && data.length > 0) {
      return {
        id: data[0].id,
        name: data[0].project_member_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Exception in findProjectManager:', error);
    return null;
  }
};

// Export the fetchProjectManagerName function to match import statements
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    const manager = await findProjectManager(projectId);
    return manager ? manager.name : null;
  } catch (error) {
    console.error('Error fetching project manager name:', error);
    return null;
  }
};
