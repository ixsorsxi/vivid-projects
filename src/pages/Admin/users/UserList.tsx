
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import UserFilter from './components/UserFilter';
import UserTable from './components/UserTable';
import { useUserManagement, UserData } from './hooks/useUserManagement';

interface UserListProps {
  onEditUser: (user: UserData) => void;
  refreshTrigger?: number; // Add refresh trigger prop
}

const UserList: React.FC<UserListProps> = ({ onEditUser, refreshTrigger }) => {
  const { users, isLoading, deleteUser, toggleUserStatus, isAdmin, fetchUsers } = useUserManagement();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users when component mounts or refreshTrigger changes
  useEffect(() => {
    console.log('UserList mounted or refreshTrigger changed, calling fetchUsers');
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return user.status === 'active' && matchesSearch;
    if (selectedTab === 'inactive') return user.status === 'inactive' && matchesSearch;
    return matchesSearch;
  });

  // Log for debugging
  useEffect(() => {
    console.log(`UserList: ${users.length} total users, ${filteredUsers.length} filtered users`);
  }, [users, filteredUsers]);

  return (
    <Card className="shadow-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold tracking-tight">Users</CardTitle>
        <CardDescription>
          Manage system users, their roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <UserFilter 
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          users={users}
        />
        
        <Tabs value={selectedTab} defaultValue="all">
          <TabsContent value={selectedTab} className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0">
            <UserTable 
              users={users}
              filteredUsers={filteredUsers}
              isLoading={isLoading}
              onDelete={deleteUser}
              onToggleStatus={toggleUserStatus}
              onEdit={onEditUser}
              isAdmin={isAdmin}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserList;
