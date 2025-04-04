
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUserDialogState } from './hooks/useUserDialogState';
import UserFormFields from './UserFormFields';
import UserDialogHeader from './components/UserDialogHeader';
import UserDialogFooter from './components/UserDialogFooter';
import { useUserFormSubmit } from './hooks/useUserFormSubmit';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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
    validateForm,
    handleInputChange,
    handleRoleChange,
    createUser,
    isAdmin
  } = useUserDialogState({ mode: 'add' });
  
  const { isSubmitting, handleAddUser } = useUserFormSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await handleAddUser(formData, createUser, onAddUser, onClose);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-lg border-input">
        <UserDialogHeader 
          title="Add New User" 
          description="Fill in the details to create a new user account."
        />
        
        <Alert className="bg-muted border-muted-foreground/20 text-sm">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          <AlertDescription>
            New users will need to confirm their email addresses before being able to log in.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit}>
          <UserFormFields 
            formData={formData}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
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
