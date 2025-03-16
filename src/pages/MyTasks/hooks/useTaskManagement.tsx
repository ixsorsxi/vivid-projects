
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
  
  // Create synchronous versions of the async functions
  const syncHandleToggleStatus = (taskId: string): Task => {
    // Find the task
    const task = syncGetTask(taskId);
    
    // Toggle the status (this is synchronous)
    task.completed = !task.completed;
    
    // Trigger the async operation in the background
    handleToggleStatus(taskId).catch(console.error);
    
    // Return the optimistically updated task
    return task;
  };
  
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
    handleToggleStatus: syncHandleToggleStatus,
    handleAddTask,
    handleViewTask,
    handleEditTask,
    handleDeleteTask,
    handleUpdateTask,
    formatDueDate,
    refetchTasks
  };
};
