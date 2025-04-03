import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import ExistingUserTab from './ExistingUserTab';
import InviteByEmailTab from './InviteByEmailTab';
import { SystemUser } from '../types';
import { useTeamMemberAddition } from '../hooks/useTeamMemberAddition';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onAddMember?: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting: externalIsSubmitting = false
}) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'email'>('existing');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Team Member');
  const { users, isLoading } = useSystemUsers();
  
  // Use our custom hook for adding team members
  const {
    isSubmitting: internalIsSubmitting,
    addExistingUser,
    addExternalMember
  } = useTeamMemberAddition(projectId);
  
  // Use external or internal submitting state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form state
    setSelectedUser(null);
    setInviteEmail('');
    setInviteRole('Team Member');
  };

  const handleSubmit = async () => {
    let success = false;
    
    if (activeTab === 'existing' && selectedUser) {
      if (onAddMember) {
        // Use provided onAddMember callback if available
        success = await onAddMember({
          id: String(selectedUser.id),
          name: selectedUser.name,
          role: selectedUser.role || 'Team Member',
          email: selectedUser.email,
          user_id: String(selectedUser.id)
        });
      } else {
        // Otherwise use our internal implementation
        success = await addExistingUser(selectedUser);
      }
    } else if (activeTab === 'email' && inviteEmail) {
      if (onAddMember) {
        // Use provided onAddMember callback if available
        success = await onAddMember({
          name: inviteEmail.split('@')[0],
          role: inviteRole,
          email: inviteEmail
        });
      } else {
        // Otherwise use our internal implementation
        success = await addExternalMember(inviteEmail, inviteRole);
      }
    }
    
    if (success) {
      handleCancel(); // Close dialog and reset form on success
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="existing" value={activeTab} onValueChange={(value) => setActiveTab(value as 'existing' | 'email')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Users</TabsTrigger>
            <TabsTrigger value="email">Invite by Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing">
            <ExistingUserTab 
              users={users}
              isLoading={isLoading}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="email">
            <InviteByEmailTab 
              inviteEmail={inviteEmail}
              inviteRole={inviteRole}
              onEmailChange={setInviteEmail}
              onRoleChange={setInviteRole}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
