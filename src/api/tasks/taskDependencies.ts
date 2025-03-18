
import { supabase } from '@/integrations/supabase/client';
import { DependencyType } from '@/lib/data';

export const fetchTaskDependencies = async (taskId: string): Promise<{taskId: string, type: DependencyType}[]> => {
  try {
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
    }));
  } catch (error) {
    console.error('Error in fetchTaskDependencies:', error);
    return [];
  }
};

export const addTaskDependency = async (
  taskId: string, 
  dependencyTaskId: string, 
  dependencyType: DependencyType
): Promise<boolean> => {
  try {
    // Prevent circular dependencies
    if (taskId === dependencyTaskId) {
      console.error('Cannot create dependency to the same task');
      return false;
    }
    
    // Check if the inverse dependency already exists
    const { data: inverseCheck } = await supabase
      .from('task_dependencies')
      .select('id')
      .eq('task_id', dependencyTaskId)
      .eq('dependency_task_id', taskId);
      
    if (inverseCheck && inverseCheck.length > 0) {
      console.error('Circular dependency detected');
      return false;
    }

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

export const checkTaskCanBeStarted = async (taskId: string): Promise<{canStart: boolean, blockers: string[]}> => {
  try {
    // Get blocking dependencies
    const { data, error } = await supabase
      .from('task_dependencies')
      .select(`
        dependency_task_id,
        dependency_type,
        tasks!task_dependencies_dependency_task_id_fkey(
          id,
          title,
          completed
        )
      `)
      .eq('task_id', taskId)
      .eq('dependency_type', 'blocking');

    if (error) {
      console.error('Error checking task dependencies:', error);
      return { canStart: true, blockers: [] };
    }

    // Find incomplete blockers
    const blockers = data
      .filter(dep => dep.tasks && !dep.tasks.completed)
      .map(dep => dep.tasks.title);

    return {
      canStart: blockers.length === 0,
      blockers
    };
  } catch (error) {
    console.error('Error in checkTaskCanBeStarted:', error);
    return { canStart: true, blockers: [] };
  }
};
