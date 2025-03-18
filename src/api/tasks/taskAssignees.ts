
import { supabase } from '@/integrations/supabase/client';
import { Assignee } from '@/lib/data';
import { getDemoUsers } from './demoData';

/**
 * Fetch available users for task assignment
 */
export const fetchAvailableUsers = async (): Promise<{ id: string, name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username');

    if (error) {
      console.error('Error fetching users:', error);
      // Return demo users as fallback
      return getDemoUsers().map(user => ({ 
        id: Math.random().toString(36).substring(2, 9), 
        name: user.name 
      }));
    }

    // Map the data to the expected format
    return data.map(user => ({
      id: user.id,
      name: user.full_name || user.username || 'Unnamed User'
    }));
  } catch (error) {
    console.error('Error in fetchAvailableUsers:', error);
    // Return demo users as fallback
    return getDemoUsers().map(user => ({ 
      id: Math.random().toString(36).substring(2, 9), 
      name: user.name 
    }));
  }
};

/**
 * Assign a user to a task
 */
export const assignUserToTask = async (taskId: string, userId: string): Promise<boolean> => {
  try {
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
    console.error('Error in assignUserToTask:', error);
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
      .match({
        task_id: taskId,
        user_id: userId
      });

    if (error) {
      console.error('Error removing user from task:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeUserFromTask:', error);
    return false;
  }
};
