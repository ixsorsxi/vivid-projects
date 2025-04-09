
import { useState } from 'react';
import { SystemUser } from '../../types';
import { debugLog, debugError } from '@/utils/debugLogger';

interface UseAddMemberDialogProps {
  onAddMember?: (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  projectId?: string;
}

/**
 * Custom hook for handling the add member dialog state and operations
 */
export const useAddMemberDialog = ({ onAddMember, projectId }: UseAddMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleAddMember = async (member: { 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string | number;
  }) => {
    if (!projectId) {
      setError('No project ID provided');
      return false;
    }

    if (!onAddMember) {
      setError('No handler provided for adding team member');
      return false;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      debugLog('useAddMemberDialog', 'Adding new team member:', member);

      // Process the member data to ensure correct types
      const memberData = {
        name: member.name,
        role: member.role,
        email: member.email,
        // Convert user_id to string if it exists and isn't already a string
        user_id: member.user_id !== undefined ? String(member.user_id) : undefined
      };

      const success = await onAddMember(memberData);

      if (success) {
        debugLog('useAddMemberDialog', 'Successfully added member');
        return true;
      } else {
        setError('Failed to add team member');
        return false;
      }
    } catch (error) {
      debugError('useAddMemberDialog', 'Error adding member:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isOpen,
    isSubmitting,
    error,
    handleOpenDialog,
    handleCloseDialog,
    handleAddMember,
  };
};

export default useAddMemberDialog;
