
import React from 'react';
import { Task } from '@/lib/data';
import { createTask } from '@/api/tasks';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskAdd = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const { isAuthenticated } = useAuth();

  const handleAddTask = async (newTaskData: Partial<Task>) => {
    try {
      if (!isAuthenticated) {
        // Offline mode fallback
        const taskId = `task-${Date.now()}`;
        const task: Task = {
          id: taskId,
          title: newTaskData.title || 'Untitled Task',
          description: newTaskData.description || '',
          status: newTaskData.status || 'to-do',
          priority: newTaskData.priority || 'medium',
          dueDate: newTaskData.dueDate || new Date().toISOString(),
          completed: newTaskData.completed || false,
          project: newTaskData.project || 'Personal Tasks',
          assignees: newTaskData.assignees || [{ name: 'Me' }]
        };
        
        setTasks(prevTasks => [...prevTasks, task]);
        
        toast("Task added", {
          description: `"${task.title}" has been added to your tasks`,
        });
        
        return task;
      }

      // Online mode - make sure we have a required title
      if (!newTaskData.title) {
        newTaskData.title = 'Untitled Task';
      }
      
      const taskToCreate = {
        title: newTaskData.title,
        description: newTaskData.description || '',
        status: newTaskData.status || 'to-do',
        priority: newTaskData.priority || 'medium',
        dueDate: newTaskData.dueDate || new Date().toISOString(),
        completed: newTaskData.completed || false,
        project: newTaskData.project || 'Personal Tasks',
        assignees: newTaskData.assignees || [{ name: 'Me' }]
      } as Omit<Task, 'id'>;
      
      const newTask = await createTask(taskToCreate);
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        
        toast("Task added", {
          description: `"${newTask.title}" has been added to your tasks`,
        });
        
        return newTask;
      }
      return null;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return null;
    }
  };

  return { handleAddTask };
};

export default useTaskAdd;
