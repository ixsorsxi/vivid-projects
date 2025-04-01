
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes all members associated with a project
 */
export const deleteProjectMembers = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId);
    
    if (error) {
      console.error("Error deleting project members:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in deleteProjectMembers:", error);
    return false;
  }
};
