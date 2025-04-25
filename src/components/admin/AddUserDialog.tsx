
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserFormData, useUserDialogState } from './hooks/useUserDialogState';
import { useAuth } from '@/context/auth/AuthContext';
import UserFormFields from './UserFormFields';
import { useUserFormSubmit } from './hooks/useUserFormSubmit';
import UserDialogFooter from './components/UserDialogFooter';
import { User, UserPlus } from 'lucide-react';

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: any) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ isOpen, onClose, onAddUser }) => {
  const auth = useAuth();
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
    
    await handleAddUser(formData, auth.createUser, onAddUser, onClose);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-xl">Add New User</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add a new user to the system. They will receive an email to activate their account.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
