
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAddMemberDialog } from './hooks/useAddMemberDialog';
import DialogHeader from './components/DialogHeader';
import TabSwitcher from './components/TabSwitcher';
import SearchUsersTab from './components/SearchUsersTab';
import EmailInviteTab from './components/EmailInviteTab';
import DialogFooter from './components/DialogFooter';

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
    isSubmitDisabled
  } = useAddMemberDialog({ onAddMember, projectId });

  const handleClose = () => {
    handleCancel();
    onOpenChange(false);
  };

  const handleAddMember = async () => {
    const success = await handleSubmit();
    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader error={error} />
        
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'existing' ? (
          <SearchUsersTab
            onSelectUser={setSelectedUser}
            onSelectRole={setSelectedRole}
            selectedUser={selectedUser}
            selectedRole={selectedRole}
            isSubmitting={externalIsSubmitting}
          />
        ) : (
          <EmailInviteTab
            onEmailChange={setInviteEmail}
            onRoleChange={setSelectedRole}
            inviteEmail={inviteEmail}
            selectedRole={selectedRole}
          />
        )}
        
        <DialogFooter
          onCancel={handleClose}
          onSubmit={handleAddMember}
          isSubmitting={externalIsSubmitting}
          isDisabled={isSubmitDisabled}
          projectId={projectId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
