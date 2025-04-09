
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAddMemberDialog } from './hooks/useAddMemberDialog';
import DialogHeader from './components/DialogHeader';
import TabSwitcher from './components/TabSwitcher';
import SearchUsersTab from './components/SearchUsersTab';
import EmailInviteTab from './components/EmailInviteTab';
import DialogFooter from './components/DialogFooter';
import { debugLog, debugError } from '@/utils/debugLogger';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onAddMember?: (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  isSubmitting?: boolean;
}

/**
 * Dialog component for adding new members to a project team
 */
const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting: externalIsSubmitting = false
}) => {
  const {
    activeTab,
    setActiveTab,
    selectedUser,
    setSelectedUser,
    selectedRole,
    setSelectedRole,
    inviteEmail,
    setInviteEmail,
    error,
    handleCancel,
    handleSubmit,
    isSubmitDisabled,
    isSubmitting: internalIsSubmitting
  } = useAddMemberDialog({ onAddMember, projectId });

  // Combine external and internal submission states
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;
  
  const handleClose = () => {
    debugLog('AddMemberDialog', 'Closing dialog and resetting state');
    handleCancel();
    onOpenChange(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debugLog('AddMemberDialog', 'Form submitted, activeTab:', activeTab);
    debugLog('AddMemberDialog', 'Selected user:', selectedUser);
    debugLog('AddMemberDialog', 'Invite email:', inviteEmail);

    try {
      const success = await handleSubmit();
      if (success) {
        debugLog('AddMemberDialog', 'Member added successfully, closing dialog');
        handleClose();
      }
    } catch (error) {
      debugError('AddMemberDialog', 'Error adding member:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader error={error} />
          
          <TabSwitcher 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            disabled={isSubmitting}
          />
          
          {activeTab === 'existing' ? (
            <SearchUsersTab
              onSelectUser={setSelectedUser}
              onSelectRole={setSelectedRole}
              selectedUser={selectedUser}
              selectedRole={selectedRole}
              isSubmitting={isSubmitting}
            />
          ) : (
            <EmailInviteTab
              onEmailChange={setInviteEmail}
              onRoleChange={setSelectedRole}
              inviteEmail={inviteEmail}
              selectedRole={selectedRole}
              disabled={isSubmitting}
            />
          )}
          
          <DialogFooter
            onCancel={handleClose}
            onSubmit={() => {}}  // Form will handle submission
            isSubmitting={isSubmitting}
            isDisabled={isSubmitDisabled}
            projectId={projectId}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
