
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
 * Note: This is an alternative approach using a database function
 */
export const useServerSideProjectDelete = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('delete_project', { p_project_id: projectId });
    
    if (error) {
      console.error("Error calling delete_project function:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("Exception in useServerSideProjectDelete:", error);
    return false;
  }
};
