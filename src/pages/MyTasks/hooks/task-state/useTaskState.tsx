
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskOperations } from '../task-operations/useTaskOperations';

export const useTaskState = (initialTasks: Task[]) => {
  const {
    tasks,
    setTasks,
    isLoading,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    refetchTasks
  } = useTaskOperations(initialTasks);

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

export default useTaskState;
