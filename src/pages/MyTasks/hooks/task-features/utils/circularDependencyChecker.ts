
import { getTaskDependencies } from '@/api/projects/modules/projectData/taskDependenciesApi';

/**
 * Checks if adding a dependency would create a circular dependency chain
 */
export const wouldCreateCircularDependency = async (
  taskId: string, 
  dependencyTaskId: string
): Promise<boolean> => {
  // Basic check - if tasks are the same, it's circular
  if (taskId === dependencyTaskId) return true;
  
  // For now, just prevent direct circular dependencies
  // A more comprehensive implementation would check for longer chains
  try {
    const dependencies = await getTaskDependencies(dependencyTaskId);
    return dependencies.some(dep => dep.task_id === taskId);
  } catch (error) {
    console.error('Error checking for circular dependencies:', error);
    return false;
  }
};
