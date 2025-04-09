
import { supabase } from '@/integrations/supabase/client';

/**
 * Finds the project manager for a given project
 */
export const findProjectManager = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name')
      .eq('project_id', projectId)
      .eq('role', 'project_manager')
      .is('left_at', null)
      .maybeSingle();

    if (error) {
      console.error('Error finding project manager:', error);
      return null;
    }

    return data;
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
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return false;
    }

    const currentUserId = data.user.id;
    
    if (!currentUserId || currentUserId !== userId) {
      return false;
    }

    const manager = await findProjectManager(projectId);
    
    return !!manager && manager.user_id === currentUserId;
  } catch (error) {
    console.error('Error in isUserProjectManager:', error);
    return false;
  }
};
