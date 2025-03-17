
import { supabase } from '@/integrations/supabase/client';

export const addTaskDependency = async (taskId: string, dependencyTaskId: string, dependencyType: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_dependencies')
      .insert({
        task_id: taskId,
        dependency_task_id: dependencyTaskId,
        dependency_type: dependencyType
      });

    if (error) {
      console.error('Error adding task dependency:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addTaskDependency:', error);
    return false;
  }
};

export const removeTaskDependency = async (taskId: string, dependencyTaskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_dependencies')
      .delete()
      .eq('task_id', taskId)
      .eq('dependency_task_id', dependencyTaskId);

    if (error) {
      console.error('Error removing task dependency:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeTaskDependency:', error);
    return false;
  }
};
