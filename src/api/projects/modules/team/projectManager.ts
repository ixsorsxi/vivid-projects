
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
        name: legacyData[0].project_member_name || 'Project Manager'
      };
    }
    
    return {
      id: data[0].id,
      name: data[0].project_member_name || 'Project Manager'
    };
  } catch (error) {
    console.error('Error in findProjectManager:', error);
    return null;
  }
};

// Function to check if a user is the project manager
export const isUserProjectManager = async (projectId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('role', 'project_manager');
    
    if (error) {
      console.error('Error checking if user is project manager:', error);
      return false;
    }
    
    // If no explicit result found, try legacy 'Project Manager' format
    if (!data || data.length === 0) {
      const { data: legacyData, error: legacyError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .ilike('role', '%Project Manager%');
        
      if (legacyError) {
        console.error('Error in legacy check:', legacyError);
        return false;
      }
      
      return legacyData && legacyData.length > 0;
    }
    
    return data.length > 0;
  } catch (error) {
    console.error('Error in isUserProjectManager:', error);
    return false;
  }
};

// Function to fetch the name of the project manager
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    const manager = await findProjectManager(projectId);
    return manager ? manager.name : null;
  } catch (error) {
    console.error('Error fetching project manager name:', error);
    return null;
  }
};

// Alias for fetchProjectManagerName to maintain backward compatibility
export const fetchTeamManagerName = fetchProjectManagerName;
