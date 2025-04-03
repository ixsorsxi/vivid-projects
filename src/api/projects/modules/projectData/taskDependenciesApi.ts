
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskDependency } from '@/lib/types/task';
import { DependencyType } from '@/lib/types/common';

/**
 * Fetches dependencies for a specific task
 */
export const fetchTaskDependencies = async (taskId: string): Promise<TaskDependency[]> => {
  try {
    if (!taskId) {
      console.error('No task ID provided for fetching dependencies');
      return [];
    }

    const { data, error } = await supabase
      .from('task_dependencies')
      .select('dependency_task_id, dependency_type')
      .eq('task_id', taskId);

    if (error) {
      console.error('Error fetching task dependencies:', error);
      return [];
    }

    return data.map(dep => ({
      taskId: dep.dependency_task_id,
      type: dep.dependency_type as DependencyType
    })) || [];
  } catch (error) {
    console.error('Error in fetchTaskDependencies:', error);
    return [];
  }
};

/**
 * Checks if adding a dependency would create a circular dependency
 */
export const wouldCreateCircularDependency = async (
  taskId: string,
  dependencyTaskId: string
): Promise<boolean> => {
  try {
    // Check if the dependency task is dependent on the original task (which would create a circle)
    const { data, error } = await supabase
      .from('task_dependencies')
      .select('*')
      .eq('task_id', dependencyTaskId)
      .eq('dependency_task_id', taskId);

    if (error) {
      console.error('Error checking circular dependency:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error in wouldCreateCircularDependency:', error);
    return false;
  }
};

/**
 * Gets all tasks that depend on the given task
 */
export const getDependentTasks = async (taskId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('task_dependencies')
      .select('task_id')
      .eq('dependency_task_id', taskId);

    if (error) {
      console.error('Error getting dependent tasks:', error);
      return [];
    }

    return data.map(record => record.task_id);
  } catch (error) {
    console.error('Error in getDependentTasks:', error);
    return [];
  }
};

/**
 * Add the Task Dependencies functionality to the exports
 */
export * from '@/api/tasks/taskDependencies';
