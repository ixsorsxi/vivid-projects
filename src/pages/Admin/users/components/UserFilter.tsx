
import React from 'react';
import { SearchBar, StatusTabs } from './filter';
import { UserData } from '../hooks/useUserManagement';

interface UserFilterProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  users: UserData[];
}

const UserFilter: React.FC<UserFilterProps> = ({ 
  selectedTab, 
  setSelectedTab, 
  searchQuery, 
  setSearchQuery,
  users
}) => {
  return (
    <div className="space-y-4">
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <StatusTabs 
        selectedTab={selectedTab} 
        setSelectedTab={setSelectedTab} 
        users={users} 
      />
    </div>
  );
};

export default UserFilter;
