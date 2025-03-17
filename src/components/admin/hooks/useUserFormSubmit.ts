
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';
import { UserFormData } from './useUserDialogState';

export const useUserFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = async (
    formData: UserFormData,
    createUser: (email: string, password: string, name: string, role: string) => Promise<boolean>,
    onAddUser: (userData: any) => void,
    onClose: () => void
  ) => {
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
        
        toast.success("User created", {
          description: "New user account has been created successfully."
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
  
  const handleEditUser = async (
    userId: string,
    formData: UserFormData,
    onEditUser: (userId: string, userData: any) => Promise<void>,
    onClose: () => void
  ) => {
    setIsSubmitting(true);
    
    try {
      await onEditUser(userId, {
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

  return {
    isSubmitting,
    setIsSubmitting,
    handleAddUser,
    handleEditUser
  };
};
