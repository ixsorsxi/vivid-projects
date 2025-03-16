
import React from 'react';
import { Task, DependencyType } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';

export const useTaskDependencies = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Handle adding a dependency to a task
  const handleAddDependency = (taskId: string, dependencyTaskId: string, dependencyType: DependencyType) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          const dependencies = task.dependencies || [];
          return {
            ...task,
            dependencies: [
              ...dependencies,
              { taskId: dependencyTaskId, type: dependencyType }
            ]
          };
        }
        return task;
      });
    });
    
    toast("Dependency added", {
      description: "Task dependency has been created",
    });
  };
  
  // Handle removing a dependency from a task
  const handleRemoveDependency = (taskId: string, dependencyTaskId: string) => {
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
    
    toast("Dependency removed", {
      description: "Task dependency has been removed",
    });
  };
  
  // Check if a task can be completed based on dependencies
  const canCompleteTask = (taskId: string): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return true;
    
    // Check if it has blocking dependencies
    if (task.dependencies) {
      const blockingDependencies = task.dependencies.filter(dep => dep.type === 'blocking');
      
      for (const dep of blockingDependencies) {
        const dependencyTask = tasks.find(t => t.id === dep.taskId);
        if (dependencyTask && !dependencyTask.completed) {
          return false;
        }
      }
    }
    
    return true;
  };

  return {
    handleAddDependency,
    handleRemoveDependency,
    canCompleteTask
  };
};

export default useTaskDependencies;
