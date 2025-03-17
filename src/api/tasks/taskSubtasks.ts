
import { supabase } from '@/integrations/supabase/client';

export const addTaskSubtask = async (parentId: string, title: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_subtasks')
      .insert({
        parent_task_id: parentId,
        title: title,
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

export const toggleSubtaskCompletion = async (subtaskId: string): Promise<boolean> => {
  try {
    // First get the current status
    const { data: currentData, error: fetchError } = await supabase
      .from('task_subtasks')
      .select('completed')
      .eq('id', subtaskId)
      .single();

    if (fetchError) {
      console.error('Error fetching subtask:', fetchError);
      return false;
    }

    // Toggle the status
    const { error } = await supabase
      .from('task_subtasks')
      .update({ completed: !currentData.completed })
      .eq('id', subtaskId);

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
    console.error('Error in deleteSubtask:', error);
    return false;
  }
};
