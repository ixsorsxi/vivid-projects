
import { useCallback } from 'react';
import { Task } from '@/lib/types/task';
import { getTaskDependencies } from '@/api/projects/modules/projectData/taskDependenciesApi';
import { mapApiDependenciesToTaskDependencies } from './utils/dependencyMappers';

/**
 * Hook for loading task dependencies
 */
export const useDependencyLoader = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  /**
   * Load task dependencies if they aren't already loaded
   */
  const loadTaskDependencies = useCallback(async (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    
    // Skip if dependencies are already loaded
    if (task.dependencies && task.dependencies.length > 0) return;
    
    try {
      const apiDependencies = await getTaskDependencies(taskId);
      
      if (apiDependencies.length > 0) {
        const mappedDependencies = mapApiDependenciesToTaskDependencies(apiDependencies);
        
        setTasks(prevTasks => prevTasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              dependencies: mappedDependencies
            };
          }
          return t;
        }));
      }
    } catch (error) {
      console.error('Error loading task dependencies:', error);
    }
  }, [tasks, setTasks]);

  return { loadTaskDependencies };
};
