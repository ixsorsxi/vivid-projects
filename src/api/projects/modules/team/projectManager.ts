
import { supabase } from '@/integrations/supabase/client';
import { getUserProjectRole } from './rolePermissions';

/**
 * Finds the project manager for a given project
 */
export const findProjectManager = async (projectId: string) => {
  try {
    // Get all project members
    const { data: members, error } = await supabase
      .from('project_members')
      .select(`
        id, 
        user_id, 
        project_member_name`)
      .eq('project_id', projectId)
      .is('left_at', null);

    if (error || !members || members.length === 0) {
      console.error('Error finding project members:', error);
      return null;
    }

    // Check each member to see if they have the project_manager role
    for (const member of members) {
      if (member.user_id) {
        const role = await getUserProjectRole(member.user_id, projectId);
        if (role === 'project_manager') {
          return member;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Exception in findProjectManager:', error);
    return null;
  }
};

/**
 * Fetches the project manager's name
 */
export const fetchProjectManagerName = async (projectId: string): Promise<string | null> => {
  try {
    const manager = await findProjectManager(projectId);
    return manager?.project_member_name || null;
  } catch (error) {
    console.error('Error in fetchProjectManagerName:', error);
    return null;
  }
};

/**
 * Checks if the current user is the project manager
 */
export const isUserProjectManager = async (projectId: string, userId: string): Promise<boolean> => {
  try {
    const role = await getUserProjectRole(userId, projectId);
    return role === 'project_manager';
  } catch (error) {
    console.error('Error in isUserProjectManager:', error);
    return false;
  }
};
