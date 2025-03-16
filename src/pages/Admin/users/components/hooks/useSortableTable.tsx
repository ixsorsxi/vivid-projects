
import { useState, useMemo } from 'react';
import { UserData } from '../../hooks/useUserManagement';
import { SortKey, SortConfig } from '../types/userTableTypes';

export const useSortableTable = (users: UserData[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    const sortableUsers = [...users];
    
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableUsers;
  }, [users, sortConfig]);

  return { sortConfig, requestSort, sortedUsers };
};
