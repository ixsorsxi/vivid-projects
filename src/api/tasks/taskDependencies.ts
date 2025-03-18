
import { supabase } from '@/integrations/supabase/client';
import { Task, DependencyType } from '@/lib/types/task';

/**
 * Add a dependency between tasks
 */
export const addTaskDependency = async (
  taskId: string, 
  dependencyTaskId: string, 
  dependencyType: DependencyType
): Promise<boolean> => {
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

/**
 * Remove a dependency between tasks
 */
export const removeTaskDependency = async (taskId: string, dependencyTaskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_dependencies')
      .delete()
      .match({
        task_id: taskId,
        dependency_task_id: dependencyTaskId
      });

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

/**
 * Check if a task's dependencies allow it to be completed
 */
export const isDependencySatisfied = async (taskId: string): Promise<boolean> => {
  try {
    // Get all blocking dependencies for this task
    const { data, error } = await supabase
      .from('task_dependencies')
      .select('dependency_task_id, dependency_type')
      .eq('task_id', taskId)
      .eq('dependency_type', 'blocking');

    if (error) {
      console.error('Error checking task dependencies:', error);
      return false;
    }

    // If no blocking dependencies, then it's satisfied
    if (!data || data.length === 0) {
      return true;
    }

    // Check if all blocking dependencies are completed
    const blockingTaskIds = data.map(dep => dep.dependency_task_id);
    
    const { data: dependencyTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, completed')
      .in('id', blockingTaskIds);

    if (tasksError) {
      console.error('Error fetching dependency tasks:', tasksError);
      return false;
    }

    // Task can be completed if all blocking dependencies are completed
    return dependencyTasks.every(task => task.completed === true);
  } catch (error) {
    console.error('Error in isDependencySatisfied:', error);
    return false;
  }
};
