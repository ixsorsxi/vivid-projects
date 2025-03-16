
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskOperations } from '../useTaskOperations';

export const useTaskState = (initialTasks: Task[]) => {
  const {
    tasks,
    setTasks,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  } = useTaskOperations(initialTasks);

  return {
    tasks,
    setTasks,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  };
};

export default useTaskState;
