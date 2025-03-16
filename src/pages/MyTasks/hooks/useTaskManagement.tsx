
import React from 'react';
import { Task } from '@/lib/data';
import useTaskState from './task-state/useTaskState';
import useTaskFilter from './task-filter/useTaskFilter';
import useTaskDialog from './task-dialog/useTaskDialog';
import useTaskAction from './task-action/useTaskAction';
import useTaskUI from './task-ui/useTaskUI';

export const useTaskManagement = (initialTasks: Task[]) => {
  // Task state and basic operations
  const {
    tasks,
    setTasks,
    handleToggleStatus: toggleStatus,
    handleAddTask: addTask,
    handleUpdateTask: updateTask,
    handleDeleteTask: deleteTask
  } = useTaskState(initialTasks);
  
  // Task filtering and sorting
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
  } = useTaskFilter(tasks);
  
  // Task dialog management
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
  } = useTaskDialog();
  
  // Task UI management
  const {
    viewType,
    setViewType,
    isViewTransitioning,
    isLoadingView,
    formatDueDate
  } = useTaskUI();
  
  // Task actions
  const {
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  } = useTaskAction(
    toggleStatus,
    addTask,
    updateTask,
    deleteTask,
    selectedTask,
    setSelectedTask,
    setIsAddTaskOpen,
    setIsEditTaskOpen,
    setIsViewTaskOpen
  );

  return {
    // Task state
    tasks,
    setTasks,
    
    // Filtering
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
    filteredTasks,
    
    // Dialogs
    isAddTaskOpen,
    setIsAddTaskOpen,
    isViewTaskOpen,
    setIsViewTaskOpen,
    isEditTaskOpen,
    setIsEditTaskOpen,
    selectedTask,
    setSelectedTask,
    
    // UI
    viewType,
    setViewType,
    isViewTransitioning,
    isLoadingView,
    
    // Actions
    handleToggleStatus,
    handleAddTask,
    handleViewTask,
    handleEditTask,
    handleDeleteTask,
    handleUpdateTask,
    formatDueDate
  };
};
