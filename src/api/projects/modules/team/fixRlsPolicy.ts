
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check project access, using the standardized can_access_project function
 * This avoids RLS recursion issues while providing consistent access checks
 * @deprecated Use checkProjectMemberAccess instead
 */
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'can_access_project',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error in fixRlsPolicy:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in fixRlsPolicy:', error);
    return false;
  }
};
