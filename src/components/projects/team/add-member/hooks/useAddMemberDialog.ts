
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
        debugLog('AddMemberDialog', `Project ID: ${projectId}, User ID: ${String(selectedUser.id)}, Role: ${selectedRole}`);
        
        if (!selectedUser.id) {
          setError('Selected user is missing an ID');
          return false;
        }
        
        if (onAddMember) {
          // Use provided onAddMember callback
          success = await onAddMember({
            name: selectedUser.name,
            role: selectedRole,
            email: selectedUser.email,
            user_id: String(selectedUser.id)
          });
          
          debugLog('AddMemberDialog', 'OnAddMember result:', success);
        } else {
          setError('No handler provided for adding team member');
          return false;
        }
      } else if (activeTab === 'email' && inviteEmail) {
        debugLog('AddMemberDialog', 'Adding by email:', inviteEmail);
        debugLog('AddMemberDialog', `Project ID: ${projectId}, Email: ${inviteEmail}, Role: ${selectedRole}`);
        
        if (onAddMember) {
          // Use provided onAddMember callback
          success = await onAddMember({
            name: inviteEmail.split('@')[0],
            role: selectedRole,
            email: inviteEmail
          });
          
          debugLog('AddMemberDialog', 'OnAddMember result:', success);
        } else {
          setError('No handler provided for adding team member');
          return false;
        }
      } else {
        setError('Please select a user or enter an email address');
        return false;
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
