
import { useCallback } from 'react';
import { isDependencySatisfied } from '@/api/tasks/taskDependencies';

/**
 * Hook for dependency validation 
 */
export const useDependencyValidation = () => {
  /**
   * Check if a task can be completed based on its dependencies
   */
  const canCompleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      return await isDependencySatisfied(taskId);
    } catch (error) {
      console.error('Error checking if dependencies are satisfied:', error);
      return false;
    }
  }, []);

  return { canCompleteTask };
};
