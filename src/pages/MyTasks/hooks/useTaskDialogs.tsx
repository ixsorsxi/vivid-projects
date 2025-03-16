
import React, { useEffect } from 'react';
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
    return () => {
      setIsAddTaskOpen(false);
      setIsViewTaskOpen(false);
      setIsEditTaskOpen(false);
      setSelectedTask(null);
    };
  }, [location]);

  const handleViewTask = (task: Task) => {
    setSelectedTask({...task});
    setIsViewTaskOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask({...task});
    setIsEditTaskOpen(true);
  };

  return {
    isAddTaskOpen,
    setIsAddTaskOpen,
    isViewTaskOpen,
    setIsViewTaskOpen,
    isEditTaskOpen,
    setIsEditTaskOpen,
    selectedTask,
    setSelectedTask,
    handleViewTask,
    handleEditTask
  };
};
