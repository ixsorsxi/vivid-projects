
import { useState, useCallback } from 'react';
import { ProjectTask } from './types';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);

  // Task management with corrected types
  const addTask = useCallback((task: ProjectTask) => {
    // Ensure task has a valid ID
    const taskWithId: ProjectTask = {
      ...task,
      id: task.id || `task-${Date.now()}`
    };
    
    setTasks(prev => [...prev, taskWithId]);
  }, []);

  const updateTask = useCallback((taskId: string, field: keyof ProjectTask, value: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, [field]: value };
      }
      return task;
    }));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    removeTask
  };
};
