
import { supabase } from '@/integrations/supabase/client';
import { Assignee } from '@/lib/data';
import { getDemoUsers } from './demoData';

export const fetchAvailableUsers = async (): Promise<Assignee[]> => {
  try {
    // In a real app, you would fetch users from Supabase
    // For now, return some dummy users
    return getDemoUsers();
  } catch (error) {
    console.error('Error in fetchAvailableUsers:', error);
    return getDemoUsers();
  }
};

// Add and manage assignees (placeholder for future implementation)
export const addTaskAssignee = async (taskId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_assignees')
      .insert({
        task_id: taskId,
        user_id: userId
      });

    if (error) {
      console.error('Error adding task assignee:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addTaskAssignee:', error);
    return false;
  }
};

export const removeTaskAssignee = async (taskId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_assignees')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing task assignee:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeTaskAssignee:', error);
    return false;
  }
};
