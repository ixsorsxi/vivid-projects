
import React from 'react';
import { Task } from '@/lib/data';

export const useTaskStateConfig = () => {
  const [selectedTab, setSelectedTab] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  
  return {
    selectedTab,
    setSelectedTab,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder
  };
};

export default useTaskStateConfig;
