
import React from 'react';
import { Task } from '@/lib/data';

export const useTaskDialogs = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [isViewTaskOpen, setIsViewTaskOpen] = React.useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

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
