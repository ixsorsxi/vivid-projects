
import React from 'react';
import { Task } from '@/lib/data';

export const useTaskFilters = (tasks: Task[]) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const [filterPriority, setFilterPriority] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'dueDate' | 'priority' | 'status'>('dueDate');
  const [activeTab, setActiveTab] = React.useState('all');
  
  // Effect to sync tab state with filterStatus
  React.useEffect(() => {
    if (activeTab === 'all') {
      setFilterStatus(null);
    } else {
      setFilterStatus(activeTab);
    }
  }, [activeTab]);
  
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = filterStatus === null || task.status === filterStatus;
      
      // Apply priority filter
      const matchesPriority = filterPriority === null || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
              priorityOrder[b.priority as keyof typeof priorityOrder];
      } else { // status
        const statusOrder = { 'to-do': 0, 'in-progress': 1, 'in-review': 2, 'completed': 3 };
        return statusOrder[a.status as keyof typeof statusOrder] - 
              statusOrder[b.status as keyof typeof statusOrder];
      }
    });
  }, [searchQuery, filterStatus, filterPriority, tasks, sortBy]);

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
