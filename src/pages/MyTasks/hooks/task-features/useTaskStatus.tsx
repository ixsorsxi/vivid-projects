
import React from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import useTaskDependencies from './useTaskDependencies';

export const useTaskStatus = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const { canCompleteTask } = useTaskDependencies(tasks, setTasks);
  
  // Update task status with dependency checking
  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    const completed = newStatus === 'completed';
    
    // Check if this task can be completed
    if (completed && !canCompleteTask(taskId)) {
      toast.error("Cannot complete task", {
        description: "This task has blocking dependencies that are not yet completed",
      });
      return false;
    }
    
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completed
          };
        }
        return task;
      });
    });
    
    return true;
  };

  return {
    handleUpdateTaskStatus
  };
};

export default useTaskStatus;
