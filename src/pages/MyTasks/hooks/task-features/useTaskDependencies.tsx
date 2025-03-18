
import React from 'react';
import { Task } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { addTaskDependency, removeTaskDependency, isDependencySatisfied } from '@/api/tasks/taskDependencies';

export const useTaskDependencies = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Add a dependency between tasks
  const handleAddDependency = async (
    taskId: string,
    dependencyTaskId: string,
    dependencyType: 'blocking' | 'waiting-on' | 'related'
  ) => {
    // Check if dependency already exists
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];
    
    // Don't allow self-dependencies
    if (taskId === dependencyTaskId) {
      toast("Cannot add dependency", {
        description: "A task cannot depend on itself"
      });
      return false;
    }

    // Check if this dependency already exists
    if (task.dependencies?.some(dep => dep.taskId === dependencyTaskId)) {
      toast("Dependency exists", {
        description: "This dependency already exists"
      });
      return false;
    }

    // Add the dependency
    const success = await addTaskDependency(taskId, dependencyTaskId, dependencyType);
    
    if (success) {
      // Update tasks state
      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            dependencies: [
              ...(t.dependencies || []),
              { taskId: dependencyTaskId, type: dependencyType }
            ]
          };
        }
        return t;
      }));
      
      toast("Dependency added", {
        description: "Task dependency has been added"
      });
      return true;
    } else {
      toast("Failed to add dependency", {
        description: "There was an error adding the dependency"
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
      
      toast("Dependency removed", {
        description: "Task dependency has been removed"
      });
      return true;
    } else {
      toast("Failed to remove dependency", {
        description: "There was an error removing the dependency"
      });
      return false;
    }
  };

  // Check if a task can be completed (all dependencies are satisfied)
  const canCompleteTask = (taskId: string): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) {
      return true; // No dependencies to check
    }

    // Check all "blocking" dependencies
    const blockingDependencies = task.dependencies.filter(
      dep => dep.type === 'blocking'
    );
    
    if (blockingDependencies.length === 0) {
      return true; // No blocking dependencies
    }
    
    // Task can be completed if all blocking dependencies are completed
    return blockingDependencies.every(dep => {
      const dependencyTask = tasks.find(t => t.id === dep.taskId);
      return dependencyTask?.completed === true;
    });
  };

  return {
    handleAddDependency,
    handleRemoveDependency,
    canCompleteTask
  };
};

export default useTaskDependencies;
