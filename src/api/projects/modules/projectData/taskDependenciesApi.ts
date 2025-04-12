
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches dependencies for a specific task
 */
export const getTaskDependencies = async (taskId: string) => {
  try {
    if (!taskId) {
      console.error('No task ID provided for fetching dependencies');
      return [];
    }

    const { data, error } = await supabase
      .from('task_dependencies')
      .select('id, task_id, dependency_task_id, dependency_type')
      .or(`task_id.eq.${taskId},dependency_task_id.eq.${taskId}`);

    if (error) {
      console.error('Error fetching task dependencies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTaskDependencies:', error);
    return [];
  }
};

/**
 * Adds a dependency between two tasks
 */
export const addTaskDependency = async (sourceTaskId: string, targetTaskId: string, dependencyType: string) => {
  try {
    if (!sourceTaskId || !targetTaskId) {
      console.error('Missing task IDs for dependency');
      return null;
    }

    const { data, error } = await supabase
      .from('task_dependencies')
      .insert({
        task_id: sourceTaskId,
        dependency_task_id: targetTaskId,
        dependency_type: dependencyType
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding task dependency:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addTaskDependency:', error);
    return null;
  }
};

/**
 * Removes a dependency between tasks
 */
export const removeTaskDependency = async (dependencyId: string) => {
  try {
    const { error } = await supabase
      .from('task_dependencies')
      .delete()
      .eq('id', dependencyId);

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
 * Updates a task dependency type
 */
export const updateTaskDependency = async (dependencyId: string, dependencyType: string) => {
  try {
    const { error } = await supabase
      .from('task_dependencies')
      .update({ dependency_type: dependencyType })
      .eq('id', dependencyId);

    if (error) {
      console.error('Error updating task dependency:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateTaskDependency:', error);
    return false;
  }
};

/**
 * Checks if adding a dependency would create a circular dependency chain
 */
export const wouldCreateCircularDependency = async (taskId: string, dependencyTaskId: string): Promise<boolean> => {
  // Basic check - if tasks are the same, it's circular
  if (taskId === dependencyTaskId) return true;
  
  try {
    // Get existing dependencies for the dependency task
    const dependencies = await getTaskDependencies(dependencyTaskId);
    
    // Check for direct circular dependency
    if (dependencies.some(dep => dep.task_id === taskId || dep.dependency_task_id === taskId)) {
      return true;
    }
    
    // For now, just check one level deep
    // A more comprehensive implementation would check for longer chains recursively
    return false;
  } catch (error) {
    console.error('Error checking for circular dependencies:', error);
    return false;
  }
};

// Alias for compatibility with existing code
export const fetchTaskDependencies = getTaskDependencies;
