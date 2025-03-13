import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/AdminLayout';
import { PlusCircle, Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/toast-wrapper';
import AddUserDialog from '@/components/admin/AddUserDialog';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const mockUsers: UserData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'active', lastLogin: '2023-10-15' },
  { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'active', lastLogin: '2023-10-16' },
  { id: '3', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'User', status: 'active', lastLogin: '2023-10-14' },
  { id: '4', name: 'Mike Peterson', email: 'mike@example.com', role: 'User', status: 'inactive', lastLogin: '2023-09-30' },
  { id: '5', name: 'Emily Wilson', email: 'emily@example.com', role: 'User', status: 'active', lastLogin: '2023-10-12' },
];

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return user.status === 'active' && matchesSearch;
    if (selectedTab === 'inactive') return user.status === 'inactive' && matchesSearch;
    return matchesSearch;
  });

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast(`User deleted`, {
      description: "The user has been deleted successfully.",
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
    toast(`User status updated`, {
      description: "The user status has been updated successfully.",
    });
  };

  const addNewUser = (userData: Omit<UserData, 'id' | 'lastLogin'>) => {
    const newId = (users.length + 1).toString();
    const today = new Date().toISOString().split('T')[0];
    
    const newUser: UserData = {
      id: newId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      lastLogin: today
    };
    
    setUsers([...users, newUser]);
    
    toast(`User added`, {
      description: `${userData.name} has been added successfully.`,
    });
  };

  return (
    <AdminLayout title="User Management" currentTab="users">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Last Login</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="border-t border-border">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.role}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{user.lastLogin}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleUserStatus(user.id)}
                              className="flex h-8 w-8 p-0 data-[state=checked]:bg-primary"
                            >
                              <span className="sr-only">
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </span>
                              <Checkbox checked={user.status === 'active'} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <AddUserDialog 
        isOpen={isAddUserDialogOpen} 
        onClose={() => setIsAddUserDialogOpen(false)} 
        onAddUser={addNewUser} 
      />
    </AdminLayout>
  );
};

export default UserManagement;
