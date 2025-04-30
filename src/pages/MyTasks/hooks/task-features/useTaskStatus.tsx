
import React from 'react';
import { Task, TaskStatus } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { toggleTaskStatus, normalizeTaskStatus } from '@/api/tasks';

export const useTaskStatus = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Handle updating a task's status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: string): Promise<boolean> => {
    const completed = newStatus === 'completed' || newStatus === 'done';
    const normalizedStatus = normalizeTaskStatus(newStatus);
    
    // Update in database
    const result = await toggleTaskStatus(taskId, completed);
    
    if (result) {
      // Update state with the properly normalized status
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              status: normalizedStatus,
              completed
            } as Task; // Explicitly cast to Task type
          }
          return task;
        })
      );
      
      return true;
    }
    
    return false;
  };

  return {
    handleUpdateTaskStatus
  };
};

export default useTaskStatus;
