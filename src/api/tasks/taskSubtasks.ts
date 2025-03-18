
import { supabase } from '@/integrations/supabase/client';
import { Task, Subtask } from '@/lib/data';

/**
 * Add a subtask to a task
 */
export const addTaskSubtask = async (taskId: string, subtaskTitle: string): Promise<boolean> => {
  try {
    // First check if the task exists
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .single();

    if (taskError || !taskData) {
      console.error('Error finding task:', taskError);
      return false;
    }

    // Insert the subtask
    const { data, error } = await supabase
      .from('task_subtasks')
      .insert({
        parent_task_id: taskId,
        title: subtaskTitle,
        completed: false
      });

    if (error) {
      console.error('Error adding subtask:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addTaskSubtask:', error);
    return false;
  }
};

/**
 * Toggle the completion status of a subtask
 */
export const toggleSubtaskCompletion = async (taskId: string, subtaskId: string, completed: boolean): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('task_subtasks')
      .update({ completed })
      .match({ id: subtaskId, parent_task_id: taskId });

    if (error) {
      console.error('Error toggling subtask completion:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in toggleSubtaskCompletion:', error);
    return false;
  }
};

/**
 * Delete a subtask
 */
export const deleteSubtask = async (taskId: string, subtaskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_subtasks')
      .delete()
      .match({ id: subtaskId, parent_task_id: taskId });

    if (error) {
      console.error('Error deleting subtask:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSubtask:', error);
    return false;
  }
};

/**
 * Get all subtasks for a task
 */
export const getTaskSubtasks = async (taskId: string): Promise<Subtask[]> => {
  try {
    const { data, error } = await supabase
      .from('task_subtasks')
      .select('*')
      .eq('parent_task_id', taskId);

    if (error) {
      console.error('Error fetching subtasks:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      completed: item.completed,
      status: 'to-do',
      priority: 'medium'
    }));
  } catch (error) {
    console.error('Error in getTaskSubtasks:', error);
    return [];
  }
};
