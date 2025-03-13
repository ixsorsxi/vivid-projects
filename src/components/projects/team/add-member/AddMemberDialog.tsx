
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteByEmailTab from './InviteByEmailTab';
import SearchUserTab from './SearchUserTab';
import { SystemUser } from '../types';

// Sample system users for demo
const SYSTEM_USERS: SystemUser[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatar: '/placeholder.svg' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatar: '/placeholder.svg' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', avatar: '/placeholder.svg' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', avatar: '/placeholder.svg' },
  { id: 5, name: 'Michael Wilson', email: 'michael@example.com', avatar: '/placeholder.svg' },
];

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember?: (email: string, role: string) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember
}) => {
  const [activeTab, setActiveTab] = useState('invite');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Team Member');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('Team Member');

  const handleAddMember = () => {
    if (activeTab === 'invite') {
      if (!inviteEmail) {
        toast.error("Error", {
          description: "Please enter an email address",
        });
        return;
      }

      // Call the passed onAddMember function if provided
      if (onAddMember) {
        onAddMember(inviteEmail, inviteRole);
      } else {
        // Fallback if no handler is provided
        toast("Invitation sent", {
          description: `An invitation has been sent to ${inviteEmail}`,
        });
      }
      
      setInviteEmail('');
    } else {
      if (!selectedUser) {
        toast.error("Error", {
          description: "Please select a user",
        });
        return;
      }

      // Call the passed onAddMember function if provided
      if (onAddMember) {
        onAddMember(selectedUser.email, selectedRole);
      } else {
        toast("User added", {
          description: `${selectedUser.name} has been added to the project`,
        });
      }
      
      setSelectedUser(null);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your project team.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">Invite by Email</TabsTrigger>
            <TabsTrigger value="search">Search Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invite" className="space-y-4 mt-4">
            <InviteByEmailTab
              inviteEmail={inviteEmail}
              inviteRole={inviteRole}
              onEmailChange={setInviteEmail}
              onRoleChange={setInviteRole}
              onCancel={() => onOpenChange(false)}
              onSubmit={handleAddMember}
            />
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4 mt-4">
            <SearchUserTab
              systemUsers={SYSTEM_USERS}
              selectedUser={selectedUser}
              selectedRole={selectedRole}
              onSelectUser={setSelectedUser}
              onSelectRole={setSelectedRole}
              onCancel={() => onOpenChange(false)}
              onSubmit={handleAddMember}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
