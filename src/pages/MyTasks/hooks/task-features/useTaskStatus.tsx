
import React from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { toggleTaskStatus } from '@/api/tasks';

export const useTaskStatus = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Handle updating a task's status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    const completed = newStatus === 'completed';
    
    // Update in database
    const result = await toggleTaskStatus(taskId, completed);
    
    if (result) {
      // Update state
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
    }
    
    return false;
  };

  return {
    handleUpdateTaskStatus
  };
};

export default useTaskStatus;
