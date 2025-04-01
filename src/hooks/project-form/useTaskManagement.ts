
import { useState, useCallback } from 'react';
import { ProjectTask } from './types';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);

  // Task management
  const addTask = useCallback((task: ProjectTask) => {
    setTasks(prev => [...prev, task]);
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
