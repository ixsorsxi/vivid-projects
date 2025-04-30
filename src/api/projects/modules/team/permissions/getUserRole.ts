
import { supabase } from '@/integrations/supabase/client';
import { ProjectRoleKey } from '@/components/projects/team/types';

/**
 * Gets the role for a user in a specific project
 */
export const getUserProjectRole = async (
  userId: string,
  projectId: string
): Promise<ProjectRoleKey | null> => {
  try {
    const { data, error } = await supabase
      .from('user_project_roles')
      .select('project_roles!inner(role_key)')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (error || !data) {
      console.log('User has no role in this project:', error);
      return null;
    }

    // Safely extract the role_key from the joined data
    if (data.project_roles && typeof data.project_roles === 'object') {
      // Since data.project_roles is a single object, not an array
      const roleKey = data.project_roles.role_key;
      if (roleKey) {
        return roleKey as ProjectRoleKey;
      }
    }

    return null;
  } catch (error) {
    console.error('Error in getUserProjectRole:', error);
    return null;
  }
};
