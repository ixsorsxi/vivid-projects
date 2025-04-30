
import { supabase } from '@/integrations/supabase/client';
import { Assignee } from '@/lib/types/task';

/**
 * Fetch available users to assign to tasks
 */
export const fetchAvailableUsers = async (): Promise<Assignee[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url');
      
    if (error) {
      console.error('Error fetching available users:', error);
      return [];
    }
    
    return data.map(user => ({
      id: user.id,
      name: user.full_name || 'Unknown User',
      avatar: user.avatar_url || undefined
    }));
  } catch (error) {
    console.error('Exception in fetchAvailableUsers:', error);
    return [];
  }
};

/**
 * Assign a user to a task
 */
export const assignUserToTask = async (taskId: string, userId: string): Promise<boolean> => {
  try {
    // Get user info to create assignee
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return false;
    }
    
    // Create assignment in task_assignees table
    const { error } = await supabase
      .from('task_assignees')
      .insert({
        task_id: taskId,
        user_id: userId
      });
      
    if (error) {
      console.error('Error assigning user to task:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in assignUserToTask:', error);
    return false;
  }
};

/**
 * Remove a user assignment from a task
 */
export const removeUserFromTask = async (taskId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_assignees')
      .delete()
      .match({ task_id: taskId, user_id: userId });
      
    if (error) {
      console.error('Error removing user from task:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in removeUserFromTask:', error);
    return false;
  }
};
