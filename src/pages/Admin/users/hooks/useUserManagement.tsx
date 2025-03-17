
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
  customRoleId?: string;
  customRoleName?: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // First get the profiles with their custom role IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, role, avatar_url, created_at, custom_role_id');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load users');
        return;
      }
      
      if (!profilesData) {
        setUsers([]);
        return;
      }
      
      // Fetch all custom roles to map IDs to names
      const { data: rolesData, error: rolesError } = await supabase
        .from('custom_roles')
        .select('id, name');
        
      if (rolesError) {
        console.error('Error fetching custom roles:', rolesError);
      }
      
      // Create a map of role IDs to role names
      const roleMap = (rolesData || []).reduce((map: Record<string, string>, role) => {
        map[role.id] = role.name;
        return map;
      }, {});
      
      const formattedUsers: UserData[] = profilesData.map(user => ({
        id: user.id,
        name: user.full_name || 'Unnamed User',
        email: user.username || '',
        role: user.role || 'user',
        status: 'active', // We don't have a status field yet, defaulting to active
        lastLogin: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Never',
        customRoleId: user.custom_role_id || undefined,
        customRoleName: user.custom_role_id ? roleMap[user.custom_role_id] : undefined
      }));
      
      setUsers(formattedUsers);
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

  const updateUser = async (userId: string, userData: {
    name: string;
    email: string;
    role: 'admin' | 'user' | 'manager';
    status: 'active' | 'inactive';
    customRoleId?: string;
  }) => {
    if (!isAdmin) {
      toast.error('Only administrators can update users');
      return;
    }
    
    try {
      const updates = {
        full_name: userData.name,
        role: userData.role,
        custom_role_id: userData.customRoleId || null,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
        return;
      }
      
      // If customRoleId is provided, get the role name
      let customRoleName: string | undefined;
      if (userData.customRoleId) {
        const { data } = await supabase
          .from('custom_roles')
          .select('name')
          .eq('id', userData.customRoleId)
          .single();
          
        customRoleName = data?.name;
      }
      
      // Update the local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { 
            ...user, 
            name: userData.name,
            role: userData.role,
            status: userData.status,
            customRoleId: userData.customRoleId,
            customRoleName
          };
        }
        return user;
      }));
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while updating the user');
      throw err; // Re-throw to handle in the UI
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
    updateUser,
    addNewUser,
    fetchUsers,
    isAdmin
  };
};
