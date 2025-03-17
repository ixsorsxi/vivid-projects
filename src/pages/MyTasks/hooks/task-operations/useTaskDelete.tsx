
import React from 'react';
import { Task } from '@/lib/data';
import { deleteTask } from '@/api/tasks';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskDelete = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const { isAuthenticated } = useAuth();

  const handleDeleteTask = async (taskId: string) => {
    try {
      const taskToDelete = tasks.find(task => task.id === taskId);
      if (!taskToDelete) return null;
      
      if (!isAuthenticated) {
        // Offline mode fallback
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        toast("Task deleted", {
          description: `"${taskToDelete.title}" has been removed from your tasks`,
        });
        
        return taskToDelete;
      }

      // Online mode
      const success = await deleteTask(taskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        toast("Task deleted", {
          description: `"${taskToDelete.title}" has been removed from your tasks`,
        });
        
        return taskToDelete;
      }
      return null;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return null;
    }
  };

  return { handleDeleteTask };
};

export default useTaskDelete;
