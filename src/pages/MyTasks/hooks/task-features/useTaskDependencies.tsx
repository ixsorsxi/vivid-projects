
import React, { useCallback } from 'react';
import { Task, TaskDependency } from '@/lib/types/task';
import { DependencyType } from '@/lib/types/common';
import { toast } from '@/components/ui/toast-wrapper';
import { 
  addTaskDependency, 
  removeTaskDependency, 
  isDependencySatisfied,
  wouldCreateCircularDependency
} from '@/api/tasks/taskDependencies';
import { fetchTaskDependencies } from '@/api/projects/modules/projectData/taskDependenciesApi';

export const useTaskDependencies = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Add a dependency between tasks with circular dependency check
  const handleAddDependency = async (
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
      toast({
        title: "Cannot add dependency",
        description: "A task cannot depend on itself"
      });
      return false;
    }

    // Check if this dependency already exists
    if (task.dependencies?.some(dep => dep.taskId === dependencyTaskId)) {
      toast({
        title: "Dependency exists",
        description: "This dependency already exists"
      });
      return false;
    }
    
    // Check for circular dependencies
    const wouldCreateCircular = await wouldCreateCircularDependency(taskId, dependencyTaskId);
    if (wouldCreateCircular) {
      toast({
        title: "Circular dependency detected",
        description: "This would create a circular dependency chain",
        variant: "destructive"
      });
      return false;
    }

    // Add the dependency
    const success = await addTaskDependency(taskId, dependencyTaskId, dependencyType);
    
    if (success) {
      // Update tasks state
      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === taskId) {
          const newDependency: TaskDependency = { 
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
      
      toast({
        title: "Dependency added",
        description: "Task dependency has been added"
      });
      return true;
    } else {
      toast({
        title: "Failed to add dependency",
        description: "There was an error adding the dependency",
        variant: "destructive"
      });
      return false;
    }
  };

  // Remove a dependency
  const handleRemoveDependency = async (taskId: string, dependencyTaskId: string) => {
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
      
      toast({
        title: "Dependency removed",
        description: "Task dependency has been removed"
      });
      return true;
    } else {
      toast({
        title: "Failed to remove dependency",
        description: "There was an error removing the dependency",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check if a task can be completed based on its dependencies
  const canCompleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      return await isDependencySatisfied(taskId);
    } catch (error) {
      console.error('Error checking if dependencies are satisfied:', error);
      return false;
    }
  }, []);

  // Load task dependencies if they aren't already loaded
  const loadTaskDependencies = useCallback(async (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    
    // Skip if dependencies are already loaded
    if (task.dependencies && task.dependencies.length > 0) return;
    
    try {
      const dependencies = await fetchTaskDependencies(taskId);
      
      if (dependencies.length > 0) {
        setTasks(prevTasks => prevTasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              dependencies
            };
          }
          return t;
        }));
      }
    } catch (error) {
      console.error('Error loading task dependencies:', error);
    }
  }, [tasks, setTasks]);

  return {
    handleAddDependency,
    handleRemoveDependency,
    canCompleteTask,
    loadTaskDependencies
  };
};

export default useTaskDependencies;
