
import { supabase } from '@/integrations/supabase/client';
import { Task, Subtask } from '@/lib/types/task';

/**
 * Fetch all subtasks for a task
 */
export const fetchTaskSubtasks = async (taskId: string): Promise<Subtask[]> => {
  try {
    const { data, error } = await supabase
      .from('task_subtasks')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching subtasks:', error);
      return [];
    }
    
    return data as Subtask[];
  } catch (error) {
    console.error('Exception in fetchTaskSubtasks:', error);
    return [];
  }
};

/**
 * Add a new subtask to a task
 */
export const addTaskSubtask = async (
  taskId: string,
  title: string,
  description?: string
): Promise<Subtask | null> => {
  try {
    const { data, error } = await supabase
      .from('task_subtasks')
      .insert({
        task_id: taskId,
        title,
        description,
        completed: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding subtask:', error);
      return null;
    }
    
    return data as Subtask;
  } catch (error) {
    console.error('Exception in addTaskSubtask:', error);
    return null;
  }
};

/**
 * Toggle the completion status of a subtask
 */
export const toggleSubtaskStatus = async (
  subtaskId: string,
  completed: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_subtasks')
      .update({ completed })
      .eq('id', subtaskId);
    
    if (error) {
      console.error('Error updating subtask status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in toggleSubtaskStatus:', error);
    return false;
  }
};

/**
 * Delete a subtask
 */
export const deleteSubtask = async (subtaskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_subtasks')
      .delete()
      .eq('id', subtaskId);
    
    if (error) {
      console.error('Error deleting subtask:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in deleteSubtask:', error);
    return false;
  }
};

/**
 * Mock subtasks for testing purposes
 */
export const mockSubtasks = (taskId: string): Subtask[] => {
  return [
    {
      id: '1',
      task_id: taskId,
      title: 'Research requirements',
      description: 'Gather all necessary information',
      completed: true
    },
    {
      id: '2',
      task_id: taskId,
      title: 'Create initial mockups',
      description: 'Design the basic layout',
      completed: false
    },
    {
      id: '3',
      task_id: taskId,
      title: 'Review with stakeholders',
      description: 'Get feedback on design',
      completed: false
    }
  ];
};
