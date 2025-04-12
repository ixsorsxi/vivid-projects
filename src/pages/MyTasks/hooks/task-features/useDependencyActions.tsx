
import { useCallback } from 'react';
import { Task } from '@/lib/types/task';
import { DependencyType } from '@/lib/types/common';
import { toast } from '@/components/ui/toast-wrapper';
import { addTaskDependency, removeTaskDependency } from '@/api/tasks/taskDependencies';
import { wouldCreateCircularDependency } from './utils/circularDependencyChecker';

/**
 * Hook for task dependency actions (add/remove)
 */
export const useDependencyActions = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  /**
   * Add a dependency between tasks with circular dependency check
   */
  const handleAddDependency = useCallback(async (
    taskId: string,
    dependencyTaskId: string,
    dependencyType: DependencyType
  ) => {
    // Check if dependency already exists
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];
    
    // Don't allow self-dependencies
    if (taskId === dependencyTaskId) {
      toast.error("Cannot add dependency", {
        description: "A task cannot depend on itself"
      });
      return false;
    }

    // Check if this dependency already exists
    if (task.dependencies?.some(dep => dep.taskId === dependencyTaskId)) {
      toast.error("Dependency exists", {
        description: "This dependency already exists"
      });
      return false;
    }
    
    // Check for circular dependencies
    const wouldCreateCircular = await wouldCreateCircularDependency(taskId, dependencyTaskId);
    if (wouldCreateCircular) {
      toast.error("Circular dependency detected", {
        description: "This would create a circular dependency chain"
      });
      return false;
    }

    // Add the dependency
    const success = await addTaskDependency(taskId, dependencyTaskId, dependencyType);
    
    if (success) {
      // Update tasks state
      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === taskId) {
          const newDependency = { 
            taskId: dependencyTaskId, 
            type: dependencyType 
          };
          return {
            ...t,
            dependencies: [
              ...(t.dependencies || []),
              newDependency
            ]
          };
        }
        return t;
      }));
      
      toast.success("Dependency added", {
        description: "Task dependency has been added"
      });
      return true;
    } else {
      toast.error("Failed to add dependency", {
        description: "There was an error adding the dependency"
      });
      return false;
    }
  }, [tasks, setTasks]);

  /**
   * Remove a dependency
   */
  const handleRemoveDependency = useCallback(async (taskId: string, dependencyTaskId: string) => {
    const success = await removeTaskDependency(taskId, dependencyTaskId);
    
    if (success) {
      // Update tasks state
      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            dependencies: (t.dependencies || []).filter(
              dep => dep.taskId !== dependencyTaskId
            )
          };
        }
        return t;
      }));
      
      toast.success("Dependency removed", {
        description: "Task dependency has been removed"
      });
      return true;
    } else {
      toast.error("Failed to remove dependency", {
        description: "There was an error removing the dependency"
      });
      return false;
    }
  }, [setTasks]);

  return {
    handleAddDependency,
    handleRemoveDependency
  };
};
