
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserDialogState } from './hooks/useUserDialogState';
import { toast } from '@/components/ui/toast-wrapper';
import { UserData } from '@/pages/Admin/users/hooks/useUserManagement';
import UserFormFields from './UserFormFields';
import { supabase } from '@/integrations/supabase/client';

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
    isSubmitting,
    setIsSubmitting,
    validateForm,
    handleInputChange,
    handleRoleChange,
    handleCustomRoleChange,
    isAdmin
  } = useUserDialogState({
    initialData: user || {},
    mode: 'edit'
  });

  React.useEffect(() => {
    if (user) {
      handleInputChange('name', user.name || '');
      handleInputChange('email', user.email || '');
      handleRoleChange(user.role as 'admin' | 'user' | 'manager');
      handleInputChange('status', user.status);
      handleInputChange('customRoleId', user.customRoleId || '');
      handleInputChange('notes', ''); // Reset notes each time
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await onEditUser(user.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        customRoleId: formData.customRoleId || undefined
      });
      
      toast.success("User updated", {
        description: "User details have been updated successfully."
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Update failed", {
        description: "An error occurred while updating the user."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-input">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit User</DialogTitle>
          <DialogDescription>
            Update user details and permissions.
          </DialogDescription>
        </DialogHeader>
        
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !isAdmin}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
