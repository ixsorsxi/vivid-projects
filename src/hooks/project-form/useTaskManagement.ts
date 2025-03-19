
import { useState } from 'react';
import { ProjectTask } from './types';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);

  // Task management
  const addTask = () => {
    const newTask: ProjectTask = {
      id: `task-${tasks.length + 1}`,
      title: '',
      description: '',
      dueDate: '',
      status: 'to-do',
      priority: 'medium'
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, field: keyof ProjectTask, value: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, [field]: value };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    removeTask
  };
};
