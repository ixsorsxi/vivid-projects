
import React, { useEffect, useCallback } from 'react';
import { Task } from '@/lib/data';
import { useLocation } from 'react-router-dom';

export const useTaskDialogs = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [isViewTaskOpen, setIsViewTaskOpen] = React.useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const location = useLocation();

  // Close dialogs and clear selected task when location changes
  useEffect(() => {
    setIsAddTaskOpen(false);
    setIsViewTaskOpen(false);
    setIsEditTaskOpen(false);
    setSelectedTask(null);
    
    // Return cleanup function
    return () => {
      setIsAddTaskOpen(false);
      setIsViewTaskOpen(false);
      setIsEditTaskOpen(false);
      setSelectedTask(null);
    };
  }, [location]);

  // Safe dialog management to prevent race conditions
  const safelySetViewTaskOpen = useCallback((open: boolean) => {
    if (!open) {
      // Add delay to ensure animations complete and prevent race conditions
      setTimeout(() => setIsViewTaskOpen(false), 100);
    } else {
      setIsViewTaskOpen(true);
    }
  }, []);

  const safelySetEditTaskOpen = useCallback((open: boolean) => {
    if (!open) {
      // Add delay to ensure animations complete and prevent race conditions
      setTimeout(() => setIsEditTaskOpen(false), 100);
    } else {
      setIsEditTaskOpen(true);
    }
  }, []);

  const handleViewTask = useCallback((task: Task) => {
    // Close any open dialogs first
    setIsEditTaskOpen(false);
    
    // Set the selected task and open view dialog with slight delay
    setTimeout(() => {
      setSelectedTask({...task});
      setIsViewTaskOpen(true);
    }, 50);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    // Close any open dialogs first
    setIsViewTaskOpen(false);
    
    // Set the selected task and open edit dialog with slight delay
    setTimeout(() => {
      setSelectedTask({...task});
      setIsEditTaskOpen(true);
    }, 50);
  }, []);

  return {
    isAddTaskOpen,
    setIsAddTaskOpen,
    isViewTaskOpen,
    setIsViewTaskOpen: safelySetViewTaskOpen,
    isEditTaskOpen,
    setIsEditTaskOpen: safelySetEditTaskOpen,
    selectedTask,
    setSelectedTask,
    handleViewTask,
    handleEditTask
  };
};
