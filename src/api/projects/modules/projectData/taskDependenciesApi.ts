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
      .select('id, source_task_id, target_task_id, dependency_type')
      .or(`source_task_id.eq.${taskId},target_task_id.eq.${taskId}`);

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
        source_task_id: sourceTaskId,
        target_task_id: targetTaskId,
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
