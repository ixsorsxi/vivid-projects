
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskFilters } from './useTaskFilters';
import { useTaskDialogs } from './useTaskDialogs';
import { useTaskOperations } from './useTaskOperations';
import { formatDueDate } from '../utils/dateUtils';

export const useTaskManagement = (initialTasks: Task[]) => {
  const {
    tasks,
    handleToggleStatus: toggleStatus,
    handleAddTask: addTask,
    handleUpdateTask: updateTask,
    handleDeleteTask: deleteTask
  } = useTaskOperations(initialTasks);
  
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    filteredTasks
  } = useTaskFilters(tasks);
  
  const {
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
  } = useTaskDialogs();
  
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
    tasks,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isViewTaskOpen,
    setIsViewTaskOpen,
    isEditTaskOpen,
    setIsEditTaskOpen,
    activeTab,
    setActiveTab,
    selectedTask,
    setSelectedTask,
    filteredTasks,
    handleToggleStatus,
    handleAddTask,
    handleViewTask,
    handleEditTask,
    handleDeleteTask,
    handleUpdateTask,
    formatDueDate
  };
};
