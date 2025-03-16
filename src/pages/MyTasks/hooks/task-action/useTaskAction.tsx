
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskActions } from '../useTaskActions';

export const useTaskAction = (
  toggleStatus: (taskId: string) => Task | undefined,
  addTask: (newTask: Partial<Task>) => Task,
  updateTask: (updatedTask: Task) => Task,
  deleteTask: (taskId: string) => Task | null,
  selectedTask: Task | null,
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>,
  setIsAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditTaskOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsViewTaskOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const {
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  } = useTaskActions({
    toggleStatus,
    addTask,
    updateTask,
    deleteTask,
    selectedTask,
    setSelectedTask,
    setIsAddTaskOpen,
    setIsEditTaskOpen,
    setIsViewTaskOpen
  });

  return {
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  };
};

export default useTaskAction;
