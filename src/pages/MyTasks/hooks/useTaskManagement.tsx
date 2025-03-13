
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskFilters } from './useTaskFilters';
import { useTaskDialogs } from './useTaskDialogs';
import { useTaskOperations } from './useTaskOperations';
import { useTaskActions } from './useTaskActions';
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
