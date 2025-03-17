
import React, { useMemo } from 'react';
import { Task } from '@/lib/data';
import { useTaskOperations } from '../task-operations/useTaskOperations';
import useTaskStateConfig from './useTaskStateConfig';

export const useTaskState = (initialTasks: Task[]) => {
  const {
    tasks,
    setTasks,
    isLoading,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    refetchTasks
  } = useTaskOperations(initialTasks);
  
  const {
    selectedTab,
    setSelectedTab,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder
  } = useTaskStateConfig();
  
  // Filter and sort tasks based on current filters
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Apply status filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(task => task.status === selectedTab);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(lowerSearch) || 
        (task.description && task.description.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Sort by due date
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return filtered;
  }, [tasks, selectedTab, searchTerm, sortOrder]);

  return {
    tasks,
    filteredTasks,
    setTasks,
    isLoading,
    selectedTab,
    setSelectedTab,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    refetchTasks
  };
};

export default useTaskState;
