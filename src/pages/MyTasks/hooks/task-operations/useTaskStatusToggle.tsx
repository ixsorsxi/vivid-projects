
import React from 'react';
import { Task } from '@/lib/data';
import { toggleTaskStatus } from '@/api/supabaseTasksApi';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskStatusToggle = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const { isAuthenticated } = useAuth();

  const handleToggleStatus = async (taskId: string) => {
    try {
      if (!isAuthenticated) {
        // Offline mode fallback
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
            const newCompleted = newStatus === 'completed';
            
            toast(`Task ${newCompleted ? 'completed' : 'reopened'}`, {
              description: `"${task.title}" has been ${newCompleted ? 'marked as complete' : 'reopened'}`,
            });
            
            return {
              ...task,
              status: newStatus,
              completed: newCompleted
            };
          }
          return task;
        });
        
        setTasks(updatedTasks);
        return updatedTasks.find(task => task.id === taskId) || null;
      }

      // Online mode
      const task = tasks.find(t => t.id === taskId);
      if (!task) return null;
      
      const updatedTask = await toggleTaskStatus(taskId, !task.completed);
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === taskId ? updatedTask : task)
        );
        
        toast(`Task ${updatedTask.completed ? 'completed' : 'reopened'}`, {
          description: `"${updatedTask.title}" has been ${updatedTask.completed ? 'marked as complete' : 'reopened'}`,
        });
        
        return updatedTask;
      }
      return null;
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast.error('Failed to update task status');
      return null;
    }
  };

  return { handleToggleStatus };
};

export default useTaskStatusToggle;
