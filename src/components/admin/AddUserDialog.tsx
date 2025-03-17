
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUserDialogState } from './hooks/useUserDialogState';
import UserFormFields from './UserFormFields';
import UserDialogHeader from './components/UserDialogHeader';
import UserDialogFooter from './components/UserDialogFooter';
import { useUserFormSubmit } from './hooks/useUserFormSubmit';

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: {
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
  }) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onClose, onAddUser }) => {
  const {
    formData,
    customRoles,
    isLoadingRoles,
    validateForm,
    handleInputChange,
    handleRoleChange,
    handleCustomRoleChange,
    createUser
  } = useUserDialogState({ mode: 'add' });
  
  const { isSubmitting, handleAddUser } = useUserFormSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await handleAddUser(formData, createUser, onAddUser, onClose);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-input">
        <UserDialogHeader 
          title="Add New User" 
          description="Fill in the details to create a new user account."
        />
        
        <form onSubmit={handleSubmit}>
          <UserFormFields 
            formData={formData}
            customRoles={customRoles}
            isLoadingRoles={isLoadingRoles}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
            handleCustomRoleChange={handleCustomRoleChange}
            mode="add"
          />
          
          <UserDialogFooter 
            onClose={onClose}
            isSubmitting={isSubmitting}
            submitLabel="Add User"
            submittingLabel="Creating..."
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
