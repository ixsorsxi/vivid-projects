
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
import { supabase } from '@/integrations/supabase/client';
import UserFormFields from './UserFormFields';

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
    isSubmitting,
    setIsSubmitting,
    validateForm,
    handleInputChange,
    handleRoleChange,
    handleCustomRoleChange,
    createUser
  } = useUserDialogState({ mode: 'add' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Use the createUser method from AuthContext
      const success = await createUser(
        formData.email, 
        formData.password || '', 
        formData.name, 
        formData.role
      );
      
      if (success) {
        // Update the user's custom role if selected
        if (formData.customRoleId) {
          // Find the user's ID by email
          const { data: userData } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', formData.email)
            .maybeSingle();
            
          if (userData?.id) {
            await supabase
              .from('profiles')
              .update({ custom_role_id: formData.customRoleId })
              .eq('id', userData.id);
          }
        }
        
        // Call the onAddUser function to update the UI
        onAddUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        });
        
        onClose();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error("User creation failed", {
        description: "An error occurred while creating the user."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-input">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
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
            mode="add"
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
