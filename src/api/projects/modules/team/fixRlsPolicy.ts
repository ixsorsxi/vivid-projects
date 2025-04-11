
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user can access a project using a safe RLS bypass approach
 */
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

/**
 * Gets a user's role in a project safely
 */
export const getProjectMemberRole = async (
  userId: string,
  projectId: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_project_roles')
      .select('project_roles!inner(role_key)')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .maybeSingle();
      
    if (error || !data) {
      console.error('Error getting project member role:', error);
      return null;
    }
    
    return data.project_roles.role_key;
  } catch (error) {
    console.error('Exception in getProjectMemberRole:', error);
    return null;
  }
};
