
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { handleDatabaseError, timeoutPromise } from './utils';

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

    // Try to update with a timeout to avoid hanging
    const updatePromise = supabase
      .from('tasks')
      .update(updateFields)
      .eq('id', taskId)
      .select()
      .single();

    // Race the database update against the timeout
    const result = await Promise.race([updatePromise, timeoutPromise<typeof updatePromise>(5000)]);
    
    if (!result) {
      console.error('Task update timed out');
      toast.error('Task update timed out', {
        description: 'The operation took too long. Please try again later.'
      });
      return null;
    }

    const { data, error } = result;

    if (error) {
      const apiError = handleDatabaseError(error);
      
      toast.error('Failed to update task', {
        description: apiError.message || 'An unexpected error occurred'
      });
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
