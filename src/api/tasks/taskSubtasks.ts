
import { Subtask } from '@/lib/types/task';

/**
 * Add a subtask to a task
 */
export const addSubtask = async (taskId: string, subtaskData: Partial<Subtask>): Promise<Subtask | null> => {
  console.log('Adding subtask', taskId, subtaskData);
  
  // In a real implementation, this would make a fetch or Supabase call
  return {
    id: `subtask-${Date.now()}`,
    task_id: taskId,
    title: subtaskData.title || '',
    completed: false,
  } as Subtask;
};

/**
 * Toggle subtask completion
 */
export const toggleSubtaskCompletion = async (subtaskId: string, completed: boolean): Promise<Subtask | null> => {
  console.log('Toggling subtask completion', subtaskId, completed);
  
  // In a real implementation, this would make a fetch or Supabase call
  return {
    id: subtaskId,
    completed,
  } as Subtask;
};

/**
 * Delete a subtask
 */
export const deleteSubtask = async (subtaskId: string): Promise<boolean> => {
  console.log('Deleting subtask', subtaskId);
  
  // Simulate successful deletion
  return true;
};
