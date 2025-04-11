
import { supabase } from '@/integrations/supabase/client';

// Function to check if the user has access to project members
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    // Use the safe RPC function to check access
    const { data, error } = await supabase.rpc(
      'check_project_member_access_safe',
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
