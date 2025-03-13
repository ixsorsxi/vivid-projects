
import React from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';

export const useTaskOperations = (initialTasks: Task[]) => {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);

  const handleToggleStatus = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
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
      })
    );
    
    return tasks.find(task => task.id === taskId);
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    const taskId = `task-${Date.now()}`;
    const task: Task = {
      id: taskId,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      status: newTask.status || 'to-do',
      priority: newTask.priority || 'medium',
      dueDate: newTask.dueDate || new Date().toISOString(),
      completed: newTask.completed || false,
      project: 'Personal Tasks',
      assignees: newTask.assignees || [{ name: 'Me' }]
    };
    
    setTasks(prevTasks => [...prevTasks, task]);
    
    toast("Task added", {
      description: `"${task.title}" has been added to your tasks`,
    });
    
    return task;
  };

  const handleUpdateTask = (updatedTask: Task) => {
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
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (!taskToDelete) return null;
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    toast("Task deleted", {
      description: `"${taskToDelete.title}" has been removed from your tasks`,
    });
    
    return taskToDelete;
  };

  return {
    tasks,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  };
};
