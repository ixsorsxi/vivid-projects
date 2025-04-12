
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes the project entity itself
 */
export const deleteProjectEntity = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      console.error("Error deleting project:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in deleteProjectEntity:", error);
    return false;
  }
};

/**
 * Calls the server-side delete_project function for faster deletion
 * Uses the new delete_project_v2 function which has improved error handling
 * and more robust cascading deletes
 */
export const useServerSideProjectDelete = async (projectId: string): Promise<boolean> => {
  try {
    // Use the new v2 function that avoids RLS issues
    const { data, error } = await supabase
      .rpc('delete_project_v2', { p_project_id: projectId });
    
    if (error) {
      console.error("Error calling delete_project_v2 function:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("Exception in useServerSideProjectDelete:", error);
    return false;
  }
};
