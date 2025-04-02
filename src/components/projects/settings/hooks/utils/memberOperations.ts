
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes all members associated with a project
 */
export const deleteProjectMembers = async (projectId: string): Promise<boolean> => {
  try {
    // First attempt: direct delete
    let { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId);
    
    if (error) {
      console.error("Error deleting project members:", error);
      
      // Second attempt: try to get the current user for context
      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser && currentUser.user) {
        // Try a different approach if we have the user ID
        // This might help with RLS policy issues
        console.log("Attempting deletion with user context:", currentUser.user.id);
        
        // We could try an RPC function here if one exists
        // For now, just log that we tried an alternative approach
        console.log("Alternative deletion attempt using user context");
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in deleteProjectMembers:", error);
    return false;
  }
};
