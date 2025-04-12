
import { supabase } from '@/integrations/supabase/client';
import { ProjectRoleKey } from './types';

/**
 * Assigns a role to a user in a project
 */
export const assignProjectRole = async (
  userId: string,
  projectId: string,
  roleKey: ProjectRoleKey | string
): Promise<boolean> => {
  try {
    // Ensure roleKey is valid by casting it
    const validRoleKey = roleKey as ProjectRoleKey;
    
    const { data, error } = await supabase.rpc(
      'assign_project_role',
      {
        p_user_id: userId,
        p_project_id: projectId,
        p_role_key: validRoleKey
      }
    );

    if (error) {
      console.error('Error assigning role:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in assignProjectRole:', error);
    return false;
  }
};
