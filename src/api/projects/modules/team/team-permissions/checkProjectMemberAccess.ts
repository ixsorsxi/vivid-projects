
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to fix RLS policies for team access
 */
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'check_project_member_access_safe',
      { p_project_id: projectId }
    );
    
    return !!data && !error;
  } catch (error) {
    console.error('Error in checkProjectMemberAccess:', error);
    return false;
  }
};
