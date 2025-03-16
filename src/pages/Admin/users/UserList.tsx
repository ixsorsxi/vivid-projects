
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import UserFilter from './components/UserFilter';
import UserTable from './components/UserTable';
import { useUserManagement, UserData } from './hooks/useUserManagement';

const UserList: React.FC = () => {
  const { users, isLoading, deleteUser, toggleUserStatus, isAdmin } = useUserManagement();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    <Card>
      <CardHeader className="pb-1">
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <UserFilter 
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          users={users}
        />
        
        <TabsContent value={selectedTab} className="mt-4">
          <UserTable 
            users={users}
            filteredUsers={filteredUsers}
            isLoading={isLoading}
            onDelete={deleteUser}
            onToggleStatus={toggleUserStatus}
            isAdmin={isAdmin}
          />
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default UserList;
