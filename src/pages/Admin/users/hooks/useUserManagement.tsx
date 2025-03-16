
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

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

  const addNewUser = async () => {
    // After successful creation, we'll refetch the users to get the updated list
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    deleteUser,
    toggleUserStatus,
    addNewUser,
    fetchUsers,
    isAdmin
  };
};
