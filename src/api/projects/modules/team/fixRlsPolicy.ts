
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check project access, used to fix RLS
 * This is kept for backward compatibility but should be replaced with checkProjectMemberAccess
 * @deprecated Use checkProjectMemberAccess instead
 */
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'direct_project_access',
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
