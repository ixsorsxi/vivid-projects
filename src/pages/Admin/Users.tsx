
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, role, avatar_url, created_at');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        return;
      }
      
      if (data) {
        const formattedUsers: UserData[] = data.map(user => ({
          id: user.id,
          name: user.full_name || 'Unnamed User',
          email: user.username || '',
          role: user.role || 'user',
          status: 'active', // We don't have a status field yet, defaulting to active
          lastLogin: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Never'
        }));
        
        setUsers(formattedUsers);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return user.status === 'active' && matchesSearch;
    if (selectedTab === 'inactive') return user.status === 'inactive' && matchesSearch;
    return matchesSearch;
  });

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      toast.error('Only administrators can delete users');
      return;
    }
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        return;
      }
      
      setUsers(users.filter(user => user.id !== userId));
      toast(`User deleted`, {
        description: "The user has been deleted successfully.",
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while deleting the user');
    }
  };

  const toggleUserStatus = async (userId: string) => {
    if (!isAdmin) {
      toast.error('Only administrators can update user status');
      return;
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    try {
      // In a real app, you might want to disable the user in auth
      // and update their profile with a status field
      
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, status: newStatus };
        }
        return user;
      }));
      
      toast(`User status updated`, {
        description: "The user status has been updated successfully.",
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while updating user status');
    }
  };

  const addNewUser = async (userData: Omit<UserData, 'id' | 'lastLogin'>) => {
    // The actual user creation is handled by the AddUserDialog component
    // which calls createUser from AuthContext
    
    // After successful creation, we'll refetch the users to get the updated list
    await fetchUsers();
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
        <Button 
          className="w-full sm:w-auto" 
          onClick={() => setIsAddUserDialogOpen(true)}
          disabled={!isAdmin}
        >
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
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">
                  Loading users...
                </div>
              ) : (
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
                                disabled={!isAdmin}
                              >
                                <span className="sr-only">
                                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                </span>
                                <Checkbox checked={user.status === 'active'} />
                              </Button>
                              <Button variant="ghost" size="icon" disabled={!isAdmin}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteUser(user.id)}
                                disabled={!isAdmin}
                              >
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
              )}
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
