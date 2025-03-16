
import React from 'react';
import { Task } from '@/lib/data';
import useTaskState from './task-state/useTaskState';
import useTaskFilter from './task-filter/useTaskFilter';
import { useTaskDialogs } from './useTaskDialogs';
import useTaskAction from './task-action/useTaskAction';
import useTaskUI from './task-ui/useTaskUI';

export const useTaskManagement = (initialTasks: Task[]) => {
  // Task state and basic operations
  const {
    tasks,
    setTasks,
    isLoading,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    refetchTasks
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
  } = useTaskDialogs();
  
  // Task UI management
  const {
    viewType,
    setViewType,
    isViewTransitioning,
    isLoadingView,
    formatDueDate
  } = useTaskUI();
  
  // Helper function to get a task (synchronous version that returns a placeholder)
  const syncGetTask = (taskId: string): Task => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task) return task;
    
    // Return a default task as a placeholder
    return {
      id: taskId,
      title: "Loading...",
      status: "to-do",
      priority: "medium",
      dueDate: new Date().toISOString(),
      assignees: [],
      description: "",
      project: "",
      completed: false
    };
  };
  
  // Task actions
  const {
    handleToggleStatus: toggleStatus,
    handleAddTask: addTask,
    handleUpdateTask: updateTask,
    handleDeleteTask: deleteTask
  } = useTaskAction(
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
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
    isLoading,
    
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
    handleToggleStatus: toggleStatus,
    handleAddTask: addTask,
    handleViewTask,
    handleEditTask,
    handleDeleteTask: deleteTask,
    handleUpdateTask: updateTask,
    formatDueDate,
    refetchTasks
  };
};
