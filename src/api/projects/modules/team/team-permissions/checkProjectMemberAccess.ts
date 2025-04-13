
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check project member access
 * Uses the standardized can_access_project function
 */
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'can_access_project',
      { p_project_id: projectId }
    );
    
    return !!data && !error;
  } catch (error) {
    console.error('Error in checkProjectMemberAccess:', error);
    return false;
  }
};
