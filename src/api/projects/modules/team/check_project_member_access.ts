
import { supabase } from '@/integrations/supabase/client';

// Function to check if the user has access to project members
// Now uses the new v2 function to avoid RLS recursion
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    // Use the safe RPC function to check access
    const { data, error } = await supabase.rpc(
      'check_project_access_v2',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error checking project member access:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception in checkProjectMemberAccess:', error);
    return false;
  }
};
