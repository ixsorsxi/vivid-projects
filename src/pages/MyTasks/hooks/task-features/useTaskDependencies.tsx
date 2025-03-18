
import React from 'react';
import { Task, DependencyType } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { addTaskDependency, removeTaskDependency, checkTaskCanBeStarted } from '@/api/tasks';

export const useTaskDependencies = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Handle adding a dependency to a task
  const handleAddDependency = async (taskId: string, dependencyTaskId: string, dependencyType: DependencyType) => {
    // Add dependency in the database
    const success = await addTaskDependency(taskId, dependencyTaskId, dependencyType);
    
    if (success) {
      // Update state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            // Create or update dependencies array
            const dependencies = task.dependencies || [];
            // Only add if it doesn't already exist
            if (!dependencies.some(dep => dep.taskId === dependencyTaskId)) {
              return {
                ...task,
                dependencies: [...dependencies, { taskId: dependencyTaskId, type: dependencyType }]
              };
            }
          }
          return task;
        });
      });
      
      toast({
        title: "Dependency added", 
        description: "Task dependency has been created",
      });
      
      return true;
    }
    
    return false;
  };
  
  // Handle removing a dependency from a task
  const handleRemoveDependency = async (taskId: string, dependencyTaskId: string) => {
    // Remove dependency from the database
    const success = await removeTaskDependency(taskId, dependencyTaskId);
    
    if (success) {
      // Update state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId && task.dependencies) {
            return {
              ...task,
              dependencies: task.dependencies.filter(dep => dep.taskId !== dependencyTaskId)
            };
          }
          return task;
        });
      });
      
      toast({
        title: "Dependency removed",
        description: "Task dependency has been removed",
      });
      
      return true;
    }
    
    return false;
  };
  
  // Check if a task can be completed based on dependencies
  const canCompleteTask = async (taskId: string): Promise<boolean> => {
    const { canStart, blockers } = await checkTaskCanBeStarted(taskId);
    
    if (!canStart && blockers.length > 0) {
      toast({
        title: "Cannot start task",
        description: `Complete these tasks first: ${blockers.join(', ')}`,
        variant: "destructive"
      });
    }
    
    return canStart;
  };

  return {
    handleAddDependency,
    handleRemoveDependency,
    canCompleteTask
  };
};

export default useTaskDependencies;
