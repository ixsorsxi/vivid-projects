
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskFetch } from './useTaskFetch';
import { useTaskStatusToggle } from './useTaskStatusToggle';
import useTaskAdd from './useTaskAdd';
import useTaskUpdate from './useTaskUpdate';
import useTaskDelete from './useTaskDelete';

export const useTaskOperations = (initialTasks: Task[] = []) => {
  const { tasks, setTasks, isLoading, refetchTasks } = useTaskFetch(initialTasks);
  const { handleToggleStatus } = useTaskStatusToggle(tasks, setTasks);
  const { handleAddTask } = useTaskAdd({ setTasks, setIsAddTaskOpen: () => {} });
  const { handleUpdateTask } = useTaskUpdate({});
  const { handleTaskDelete } = useTaskDelete();

  return {
    tasks,
    setTasks,
    isLoading,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask: (task: Task) => handleUpdateTask(task),
    handleDeleteTask: (taskId: string) => handleTaskDelete(taskId),
    refetchTasks
  };
};

export default useTaskOperations;
