
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUserDialogState } from './hooks/useUserDialogState';
import { UserData } from '@/pages/Admin/users/hooks/useUserManagement';
import UserFormFields from './UserFormFields';
import UserDialogHeader from './components/UserDialogHeader';
import UserDialogFooter from './components/UserDialogFooter';
import { useUserFormSubmit } from './hooks/useUserFormSubmit';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (userId: string, userData: {
    name: string;
    email: string;
    role: 'admin' | 'user' | 'manager';
    status: 'active' | 'inactive';
    customRoleId?: string;
  }) => Promise<void>;
  user: UserData | null;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ 
  isOpen, 
  onClose, 
  onEditUser, 
  user 
}) => {
  const {
    formData,
    customRoles,
    isLoadingRoles,
    validateForm,
    handleInputChange,
    handleRoleChange,
    handleCustomRoleChange,
    isAdmin
  } = useUserDialogState({
    initialData: user ? {
      name: user.name || '',
      email: user.email || '',
      role: (user.role as 'admin' | 'user' | 'manager') || 'user',
      status: user.status || 'active',
      customRoleId: user.customRoleId || '',
      notes: ''
    } : {},
    mode: 'edit'
  });
  
  const { isSubmitting, handleEditUser: submitEditUser } = useUserFormSubmit();

  React.useEffect(() => {
    if (user) {
      handleInputChange('name', user.name || '');
      handleInputChange('email', user.email || '');
      // Cast to ensure type safety
      handleRoleChange((user.role as 'admin' | 'user' | 'manager') || 'user');
      handleInputChange('status', user.status || 'active');
      handleInputChange('customRoleId', user.customRoleId || '');
      handleInputChange('notes', ''); // Reset notes each time
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    await submitEditUser(user.id, formData, onEditUser, onClose);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-input">
        <UserDialogHeader 
          title="Edit User" 
          description="Update user details and permissions." 
        />
        
        <form onSubmit={handleSubmit}>
          <UserFormFields 
            formData={formData}
            customRoles={customRoles}
            isLoadingRoles={isLoadingRoles}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
            handleCustomRoleChange={handleCustomRoleChange}
            mode="edit"
          />
          
          <UserDialogFooter 
            onClose={onClose}
            isSubmitting={isSubmitting}
            isDisabled={!isAdmin}
            submitLabel="Save Changes"
            submittingLabel="Saving..."
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
