
import React from 'react';
import { Task } from '@/lib/data';
import { updateTask } from '@/api/supabaseTasksApi';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskUpdate = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const { isAuthenticated } = useAuth();

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      if (!isAuthenticated) {
        // Offline mode fallback
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === updatedTask.id) {
              toast("Task updated", {
                description: `"${updatedTask.title}" has been updated`,
              });
              
              return updatedTask;
            }
            return task;
          })
        );
        
        return updatedTask;
      }

      // Online mode
      const result = await updateTask(updatedTask.id, updatedTask);
      if (result) {
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === result.id ? result : task)
        );
        
        toast("Task updated", {
          description: `"${result.title}" has been updated`,
        });
        
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return null;
    }
  };

  return { handleUpdateTask };
};

export default useTaskUpdate;
