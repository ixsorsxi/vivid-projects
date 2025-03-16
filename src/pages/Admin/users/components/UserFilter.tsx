
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return user.status === 'active' && matchesSearch;
    if (selectedTab === 'inactive') return user.status === 'inactive' && matchesSearch;
    return matchesSearch;
  });

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          prefix={<Search className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default UserFilter;
