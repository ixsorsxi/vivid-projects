
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { UserData } from './useUserTypes';

export const useUserMutations = (
  users: UserData[],
  setUsers: React.Dispatch<React.SetStateAction<UserData[]>>,
  fetchUsers: () => Promise<void>
) => {
  const auth = useAuth();
  
  // Add isAdmin property to auth context for typescript
  const isAdmin = auth.isAdmin || false;

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
      toast.success("User deleted", {
        description: "The user has been deleted successfully."
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
      
      toast.success("User status updated", {
        description: "The user status has been updated successfully."
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
  }) => {
    if (!isAdmin) {
      toast.error('Only administrators can update users');
      return;
    }
    
    try {
      const updates = {
        full_name: userData.name,
        role: userData.role
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
      
      // Update the local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { 
            ...user, 
            name: userData.name,
            role: userData.role,
            status: userData.status
          };
        }
        return user;
      }));

      toast.success("User updated", {
        description: "User information has been updated successfully."
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while updating the user');
      throw err; // Re-throw to handle in the UI
    }
  };

  return {
    deleteUser,
    toggleUserStatus,
    updateUser,
    isAdmin
  };
};
