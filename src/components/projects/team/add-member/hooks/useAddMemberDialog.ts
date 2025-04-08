
import { useState } from 'react';
import { SystemUser } from '../../types';
import { debugLog, debugError } from '@/utils/debugLogger';
import { toast } from '@/components/ui/toast-wrapper';

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

export const useAddMemberDialog = ({ onAddMember, projectId }: UseAddMemberDialogProps) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'email'>('existing');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('Team Member');
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    // Reset form state
    setSelectedUser(null);
    setSelectedRole('Team Member');
    setInviteEmail('');
    setError(null);
    setActiveTab('existing');
  };

  const validateForm = (): boolean => {
    setError(null);
    
    if (activeTab === 'existing') {
      if (!selectedUser) {
        setError('Please select a user to add to the project');
        return false;
      }
    } else if (activeTab === 'email') {
      if (!inviteEmail) {
        setError('Please enter an email address');
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteEmail)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    
    if (!selectedRole) {
      setError('Please select a role');
      return false;
    }
    
    if (!projectId) {
      setError('Project ID is missing');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return false;
    }
    
    if (!onAddMember) {
      setError('No handler provided for adding team member');
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      debugLog('useAddMemberDialog', 'Starting submission with activeTab:', activeTab);
      
      if (activeTab === 'existing' && selectedUser) {
        debugLog('useAddMemberDialog', 'Adding existing user:', selectedUser);
        
        const success = await onAddMember({
          name: selectedUser.name,
          role: selectedRole,
          email: selectedUser.email,
          user_id: selectedUser.id ? String(selectedUser.id) : undefined
        });
        
        debugLog('useAddMemberDialog', 'onAddMember result:', success);
        return success;
      } else if (activeTab === 'email' && inviteEmail) {
        debugLog('useAddMemberDialog', 'Adding by email:', inviteEmail);
        
        const success = await onAddMember({
          name: inviteEmail.split('@')[0], // Use part before @ as a default name
          role: selectedRole,
          email: inviteEmail
        });
        
        debugLog('useAddMemberDialog', 'onAddMember result:', success);
        return success;
      } else {
        setError('Please select a user or enter an email address');
        return false;
      }
    } catch (error) {
      debugError('useAddMemberDialog', 'Error in handleSubmit:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add team member';
      
      setError(errorMessage);
      toast.error('Failed to add team member', {
        description: errorMessage
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = (
    (activeTab === 'existing' && !selectedUser) || 
    (activeTab === 'email' && !inviteEmail) || 
    !selectedRole || 
    isSubmitting
  );

  return {
    activeTab,
    setActiveTab,
    selectedUser,
    setSelectedUser,
    selectedRole,
    setSelectedRole,
    inviteEmail,
    setInviteEmail,
    error,
    setError,
    isSubmitting,
    handleCancel,
    handleSubmit,
    isSubmitDisabled
  };
};
