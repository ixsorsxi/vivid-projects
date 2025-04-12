
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check project access, used to fix RLS issues
 * Now using the improved non-recursive implementation
 * @deprecated Use checkProjectMemberAccess instead
 */
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'check_project_access_v2',
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
