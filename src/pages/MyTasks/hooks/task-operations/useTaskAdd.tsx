
import React from 'react';
import { Task } from '@/lib/data';
import { createTask } from '@/api/tasks';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskAdd = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const { isAuthenticated, user } = useAuth();

  const handleAddTask = async (newTaskData: Partial<Task>) => {
    try {
      if (!isAuthenticated || !user) {
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
        
        // Update local state immediately
        setTasks(prevTasks => [task, ...prevTasks]);
        
        toast("Task added", 
          { description: `"${task.title}" has been added to your tasks` }
        );
        
        return task;
      }

      // Online mode - ensure we have required fields
      if (!newTaskData.title) {
        toast.error("Error", {
          description: "Task title is required",
        });
        return null;
      }
      
      const taskToCreate = {
        title: newTaskData.title,
        description: newTaskData.description || '',
        status: newTaskData.status || 'to-do',
        priority: newTaskData.priority || 'medium',
        dueDate: newTaskData.dueDate || new Date().toISOString(),
        completed: newTaskData.completed || false,
        project: newTaskData.project || null,
        assignees: newTaskData.assignees || [{ name: user.profile?.full_name || 'Me' }]
      } as Omit<Task, 'id'>;
      
      console.log("Creating task with data:", taskToCreate, "for user:", user.id);
      
      // Call the API function with the user ID explicitly
      const newTask = await createTask(taskToCreate, user.id);
      
      if (newTask) {
        console.log("Successfully created task:", newTask);
        
        // Update local state immediately with new task at beginning of array
        setTasks(prevTasks => [newTask, ...prevTasks]);
        
        toast("Task added", { 
          description: `"${newTask.title}" has been added to your tasks` 
        });
        
        return newTask;
      } else {
        console.error("Task creation returned null");
        toast.error("Error", {
          description: "Failed to add task - please try again",
        });
      }
      return null;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Error", {
        description: "Failed to add task - server error",
      });
      return null;
    }
  };

  return { handleAddTask };
};

export default useTaskAdd;
