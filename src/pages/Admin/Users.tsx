
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import AddUserDialog from '@/components/admin/AddUserDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';
import UserList from './users/UserList';
import { useUserManagement, UserData } from './users/hooks/useUserManagement';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';

const UserManagement = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const { addNewUser, fetchUsers, updateUser, users, isLoading } = useUserManagement();
  const { isAdmin } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state

  const handleAddUser = async (userData: any) => {
    await addNewUser();
    // Increment refresh trigger to force UserList to reload
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async (userId: string, userData: {
    name: string;
    email: string;
    role: 'admin' | 'user' | 'manager';
    status: 'active' | 'inactive';
  }) => {
    await updateUser(userId, userData);
    // Increment refresh trigger to force UserList to reload
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
    setRefreshTrigger(prev => prev + 1); // Increment refresh trigger
    
    if (users.length === 0) {
      toast.info("No users found", {
        description: "No user profiles were found in the database"
      });
    } else {
      toast.success(`${users.length} users loaded`, {
        description: "User data has been refreshed"
      });
    }
  };

  return (
    <AdminLayout title="User Management" currentTab="users">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        <Button 
          className="w-full sm:w-auto shadow-sm" 
          onClick={() => setIsAddUserDialogOpen(true)}
          disabled={!isAdmin}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {users.length === 0 && !isLoading && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No users found</h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            No user profiles were found in the database. If you believe this is an error, try refreshing the page or check database permissions.
          </p>
        </div>
      )}

      <UserList 
        onEditUser={handleEditUser} 
        refreshTrigger={refreshTrigger} // Pass refresh trigger
      />

      <AddUserDialog 
        isOpen={isAddUserDialogOpen} 
        onClose={() => setIsAddUserDialogOpen(false)} 
        onAddUser={handleAddUser} 
      />

      <EditUserDialog
        isOpen={isEditUserDialogOpen}
        onClose={() => setIsEditUserDialogOpen(false)}
        onEditUser={handleUpdateUser}
        user={selectedUser}
      />
    </AdminLayout>
  );
};

export default UserManagement;
