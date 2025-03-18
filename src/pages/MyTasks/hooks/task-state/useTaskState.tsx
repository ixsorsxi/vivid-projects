
import React from 'react';
import { Task } from '@/lib/types/task';
import useTaskOperations from '../task-operations/useTaskOperations';

/**
 * A hook that manages task state and basic operations
 */
const useTaskState = (initialTasks: Task[] = []) => {
  // Use the task operations hook to get all the task CRUD methods
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

export { useTaskState };
export default useTaskState;
