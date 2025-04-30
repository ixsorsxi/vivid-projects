
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/types/task';

/**
 * Toggle a task's completion status
 */
export const toggleTaskStatus = async (taskId: string, completed: boolean): Promise<boolean> => {
  try {
    const status = completed ? 'done' : 'to-do';
    
    const { error } = await supabase
      .from('tasks')
      .update({
        status,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('id', taskId);
      
    if (error) {
      console.error('Error toggling task status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in toggleTaskStatus:', error);
    return false;
  }
};

/**
 * Fetch tasks for a user
 */
export const fetchUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assignee_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user tasks:', error);
      return [];
    }
    
    return data as Task[];
  } catch (error) {
    console.error('Exception in fetchUserTasks:', error);
    return [];
  }
};

/**
 * Converts task status string to TaskStatus enum
 */
export const normalizeTaskStatus = (status: string): 'to-do' | 'in-progress' | 'in-review' | 'done' => {
  switch (status.toLowerCase()) {
    case 'todo':
    case 'to-do':
    case 'not started':
      return 'to-do';
    case 'in progress':
    case 'in-progress':
      return 'in-progress';
    case 'in review':
    case 'in-review':
      return 'in-review';
    case 'done':
    case 'completed':
      return 'done';
    default:
      return 'to-do';
  }
};
