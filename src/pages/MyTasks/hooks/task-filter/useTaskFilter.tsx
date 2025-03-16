
import React from 'react';
import { Task } from '@/lib/data';
import { useTaskFilters } from '../useTaskFilters';

export const useTaskFilter = (tasks: Task[]) => {
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

  return {
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
  };
};

export default useTaskFilter;
