
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { UserFormData, useUserDialogState } from './hooks/useUserDialogState';
import { useAuth } from '@/context/auth';
import UserFormFields from './UserFormFields';
import { useUserFormSubmit } from './hooks/useUserFormSubmit';
import UserDialogHeader from './components/UserDialogHeader';
import UserDialogFooter from './components/UserDialogFooter';

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: any) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onClose, onAddUser }) => {
  const { createUser } = useAuth();
  const { 
    formData, 
    handleInputChange,
    handleRoleChange,
    validateForm,
    isAdmin 
  } = useUserDialogState({
    initialData: {},
    mode: 'add'
  });
  
  const { isSubmitting, handleAddUser } = useUserFormSubmit();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    await handleAddUser(formData, createUser, onAddUser, onClose);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle>Add New User</DialogTitle>
        <UserDialogHeader 
          title="Create User Account" 
          description="Add a new user to the system. They will receive an email to activate their account." 
        />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
            mode="add"
          />
          
          <UserDialogFooter 
            onClose={handleClose}
            isSubmitting={isSubmitting}
            isDisabled={!isAdmin}
            submitLabel="Create User"
            submittingLabel="Creating..."
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
