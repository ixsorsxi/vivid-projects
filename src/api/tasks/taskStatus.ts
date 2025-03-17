
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/data';

export const toggleTaskStatus = async (taskId: string, completed: boolean): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling task status:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      completed: data.completed,
      project: data.project_id,
      assignees: [] // We don't load assignees here for simplicity
    };
  } catch (error) {
    console.error('Error in toggleTaskStatus:', error);
    return null;
  }
};
