
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import AddUserDialog from '@/components/admin/AddUserDialog';
import UserList from './users/UserList';
import { useUserManagement } from './users/hooks/useUserManagement';
import { useAuth } from '@/context/auth';

const UserManagement = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const { addNewUser } = useUserManagement();
  const { isAdmin } = useAuth();

  const handleAddUser = async (userData: any) => {
    await addNewUser();
  };

  return (
    <AdminLayout title="User Management" currentTab="users">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1"></div>
        <Button 
          className="w-full sm:w-auto" 
          onClick={() => setIsAddUserDialogOpen(true)}
          disabled={!isAdmin}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      <UserList />

      <AddUserDialog 
        isOpen={isAddUserDialogOpen} 
        onClose={() => setIsAddUserDialogOpen(false)} 
        onAddUser={handleAddUser} 
      />
    </AdminLayout>
  );
};

export default UserManagement;
