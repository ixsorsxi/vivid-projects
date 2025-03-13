
import React from 'react';
import { Task } from '@/lib/data';

interface UseTaskActionsProps {
  toggleStatus: (taskId: string) => Task | undefined;
  addTask: (newTask: Partial<Task>) => Task;
  updateTask: (updatedTask: Task) => Task;
  deleteTask: (taskId: string) => Task | null;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsViewTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useTaskActions = ({
  toggleStatus,
  addTask,
  updateTask,
  deleteTask,
  selectedTask,
  setSelectedTask,
  setIsAddTaskOpen,
  setIsEditTaskOpen,
  setIsViewTaskOpen
}: UseTaskActionsProps) => {
  
  const handleToggleStatus = (taskId: string) => {
    const updatedTask = toggleStatus(taskId);
    
    // If this is the selected task, update it too
    if (selectedTask && selectedTask.id === taskId && updatedTask) {
      setSelectedTask(updatedTask);
    }
  };
  
  const handleAddTask = (newTask: Partial<Task>) => {
    addTask(newTask);
    setIsAddTaskOpen(false);
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);
    setSelectedTask(updatedTask);
    setIsEditTaskOpen(false);
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    
    // If the deleted task is selected, clear selection
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
      setIsViewTaskOpen(false);
      setIsEditTaskOpen(false);
    }
  };

  return {
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  };
};
