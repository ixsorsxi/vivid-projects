
import { supabase } from '@/integrations/supabase/client';
import { mapLegacyRole } from './rolePermissions';

// Function to find a project's manager among team members
export const findProjectManager = async (projectId: string): Promise<{ id: string; name: string } | null> => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select('id, project_member_name, role')
      .eq('project_id', projectId)
      .eq('role', 'project_manager');
    
    if (error) {
      console.error('Error finding project manager:', error);
      return null;
    }
    
    // If no explicit project_manager role found, try legacy 'Project Manager' format
    if (!data || data.length === 0) {
      const { data: legacyData, error: legacyError } = await supabase
        .from('project_members')
        .select('id, project_member_name, role')
        .eq('project_id', projectId)
        .ilike('role', '%Project Manager%');
      
      if (legacyError || !legacyData || legacyData.length === 0) {
        console.log('No project manager found for project:', projectId);
        return null;
      }
      
      return {
        id: legacyData[0].id,
        name: legacyData[0].project_member_name
      };
    }
    
    // Return the first project manager found
    return {
      id: data[0].id,
      name: data[0].project_member_name
    };
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

// Check if a user is the project manager
export const isUserProjectManager = async (projectId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('role', 'project_manager')
      .maybeSingle();
    
    if (error) {
      console.error('Error checking if user is project manager:', error);
      return false;
    }
    
    // If no explicit project_manager role found, try legacy 'Project Manager' format
    if (!data) {
      const { data: legacyData, error: legacyError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .ilike('role', '%Project Manager%')
        .maybeSingle();
      
      if (legacyError || !legacyData) {
        return false;
      }
      
      return true;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception in isUserProjectManager:', error);
    return false;
  }
};
