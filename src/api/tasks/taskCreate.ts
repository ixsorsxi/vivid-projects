
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { TaskCreateData } from './types';
import { handleDatabaseError, timeoutPromise } from './utils';

export const createTask = async (task: Omit<Task, 'id'>, userId?: string): Promise<Task | null> => {
  try {
    // If no userId is provided, try to get it from the current session
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData.user?.id;
      
      if (!userId) {
        console.error('Unable to determine user ID for task creation');
        return null;
      }
    }

    console.log(`Creating task for user ${userId} with data:`, task);

    // Prepare task data for insertion
    const taskForDb: TaskCreateData = {
      title: task.title,
      description: task.description || '',
      status: task.status || 'to-do',
      priority: task.priority || 'medium',
      due_date: task.dueDate || undefined,
      completed: task.completed || false,
      project_id: task.project || undefined,
      user_id: userId  // This sets the task owner to the current user
    };

    console.log('Prepared task data for DB insertion:', taskForDb);

    // Try to insert with a timeout to avoid hanging
    const insertPromise = supabase
      .from('tasks')
      .insert(taskForDb)
      .select()
      .single();

    // Race the database insert against the timeout
    const result = await Promise.race([insertPromise, timeoutPromise<typeof insertPromise>(5000)]);
    
    if (!result) {
      console.error('Task creation timed out');
      toast.error('Task creation timed out', {
        description: 'The operation took too long. Please try again later.'
      });
      return null;
    }

    const { data, error } = result;

    if (error) {
      console.error('Error creating task:', error);
      const apiError = handleDatabaseError(error);
      
      toast.error('Failed to create task', {
        description: apiError.message || 'An unexpected error occurred'
      });
      return null;
    }

    console.log('Task created successfully:', data);

    // Return the newly created task with the correct structure
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
    console.error('Exception in createTask:', error);
    toast.error('Failed to create task', {
      description: 'An unexpected error occurred. Please try again later.'
    });
    return null;
  }
};
