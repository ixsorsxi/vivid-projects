
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

export const useAddMemberDialog = ({ onAddMember, projectId }: UseAddMemberDialogProps) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'email'>('existing');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('Team Member');
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    // Reset form state
    setSelectedUser(null);
    setSelectedRole('Team Member');
    setInviteEmail('');
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    let success = false;
    
    try {
      if (activeTab === 'existing' && selectedUser) {
        debugLog('AddMemberDialog', 'Adding existing user:', selectedUser);
        
        if (onAddMember) {
          // Use provided onAddMember callback
          success = await onAddMember({
            name: selectedUser.name,
            role: selectedRole,
            email: selectedUser.email,
            user_id: String(selectedUser.id)
          });
        } else {
          setError('No handler provided for adding team member');
          return;
        }
      } else if (activeTab === 'email' && inviteEmail) {
        debugLog('AddMemberDialog', 'Adding by email:', inviteEmail);
        
        if (onAddMember) {
          // Use provided onAddMember callback
          success = await onAddMember({
            name: inviteEmail.split('@')[0],
            role: selectedRole,
            email: inviteEmail
          });
        } else {
          setError('No handler provided for adding team member');
          return;
        }
      } else {
        setError('Please select a user or enter an email address');
        return;
      }
      
      if (success) {
        return true;
      }
      return false;
    } catch (error) {
      debugError('AddMemberDialog', 'Error in handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'Failed to add team member');
      return false;
    }
  };

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
    handleCancel,
    handleSubmit,
    isSubmitDisabled: !(selectedUser || (activeTab === 'email' && inviteEmail))
  };
};
