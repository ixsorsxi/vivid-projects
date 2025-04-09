
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import UserSelector from '../../user-select/UserSelector';
import RoleSelector from '../../role-select/RoleSelector';
import { SystemUser } from '../../types';

interface DialogContentProps {
  role: string;
  setRole: (role: string) => void;
  selectedUser: SystemUser | null;
  setSelectedUser: (user: SystemUser | null) => void;
  systemUsers: SystemUser[];
  isLoadingUsers: boolean;
  error: string | null;
  isSubmitting: boolean;
}

const DialogContent: React.FC<DialogContentProps> = ({
  role,
  setRole,
  selectedUser,
  setSelectedUser,
  systemUsers,
  isLoadingUsers,
  error,
  isSubmitting
}) => {
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-4">
        <UserSelector
          users={systemUsers}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          isLoading={isLoadingUsers}
          disabled={isSubmitting}
        />
        
        <RoleSelector
          selectedRole={role}
          onRoleChange={setRole}
          disabled={isSubmitting}
          className="mt-4"
        />
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DialogContent;
