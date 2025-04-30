
import { supabase } from '@/integrations/supabase/client';
import { Subtask } from '@/lib/types/task';

export const addSubtask = async (taskId: string, title: string): Promise<Subtask | null> => {
  try {
    const newSubtask = {
      task_id: taskId,
      title,
      completed: false,
    };

    const { data, error } = await supabase
      .from('subtasks')
      .insert(newSubtask)
      .select('*')
      .single();

    if (error) {
      console.error('Error adding subtask:', error);
      return null;
    }

    return data as Subtask;
  } catch (error) {
    console.error('Exception in addSubtask:', error);
    return null;
  }
};

export const deleteSubtask = async (subtaskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subtasks')
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

export const toggleSubtaskCompletion = async (subtaskId: string, completed: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subtasks')
      .update({ completed })
      .eq('id', subtaskId);

    if (error) {
      console.error('Error toggling subtask completion:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in toggleSubtaskCompletion:', error);
    return false;
  }
};
