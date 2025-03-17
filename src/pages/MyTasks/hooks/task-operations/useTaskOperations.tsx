
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskFetch } from './useTaskFetch';
import { useTaskStatusToggle } from './useTaskStatusToggle';
import { useTaskAdd } from './useTaskAdd';
import { useTaskUpdate } from './useTaskUpdate';
import { useTaskDelete } from './useTaskDelete';

export const useTaskOperations = (initialTasks: Task[] = []) => {
  const { tasks, setTasks, isLoading, refetchTasks } = useTaskFetch(initialTasks);
  const { handleToggleStatus } = useTaskStatusToggle(tasks, setTasks);
  const { handleAddTask } = useTaskAdd(tasks, setTasks);
  const { handleUpdateTask } = useTaskUpdate(tasks, setTasks);
  const { handleDeleteTask } = useTaskDelete(tasks, setTasks);

  return {
    tasks,
    setTasks,
    isLoading,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    refetchTasks
  };
};

export default useTaskOperations;
