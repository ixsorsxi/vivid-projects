
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/data';

export const createTask = async (task: Omit<Task, 'id'>, userId?: string): Promise<Task | null> => {
  try {
    // If no userId is provided, try to get it from the current session
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData.user?.id;
    }

    // If still no userId, return null as we can't create the task
    if (!userId) {
      console.error('No user ID available for task creation');
      return null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate,
        completed: task.completed || false,
        project_id: task.project, // Use project property
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }

    // Return the newly created task
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      completed: data.completed,
      project: data.project_id,
      assignees: task.assignees || []
    };
  } catch (error) {
    console.error('Error in createTask:', error);
    return null;
  }
};

export const updateTask = async (taskId: string, task: Partial<Task>, userId?: string): Promise<Task | null> => {
  try {
    // If no userId is provided, try to get it from the current session
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData.user?.id;
    }

    // Update fields to send to the database
    const updateFields: any = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      completed: task.completed,
      project_id: task.project // Use project property
    };

    // If we have a userId, include it in the update
    if (userId) {
      updateFields.user_id = userId;
    }

    // Update the main task data
    const { data, error } = await supabase
      .from('tasks')
      .update(updateFields)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }

    // Return the updated task
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      completed: data.completed,
      project: data.project_id,
      assignees: task.assignees || []
    };
  } catch (error) {
    console.error('Error in updateTask:', error);
    return null;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    // Delete the task (cascade will handle related records)
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTask:', error);
    return false;
  }
};
