
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { handleDatabaseError, timeoutPromise } from './utils';

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    // Try to delete with a timeout to avoid hanging
    const deletePromise = supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    // Race the database delete against the timeout
    const result = await Promise.race([deletePromise, timeoutPromise<typeof deletePromise>(5000)]);
    
    if (!result) {
      console.error('Task deletion timed out');
      toast.error('Task deletion timed out', {
        description: 'The operation took too long. Please try again later.'
      });
      return false;
    }

    const { error } = result;

    if (error) {
      const apiError = handleDatabaseError(error);
      
      toast.error('Failed to delete task', {
        description: apiError.message || 'An unexpected error occurred'
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTask:', error);
    return false;
  }
};
