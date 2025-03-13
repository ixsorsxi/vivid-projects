
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast-wrapper";
import { Search, AtSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemUser } from '../types';
import SearchUserTab from './SearchUserTab';
import InviteByEmailTab from './InviteByEmailTab';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (email: string, role: string) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember
}) => {
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');

  // Mock data for system users - in a real application, this would come from an API
  const [systemUsers] = useState<SystemUser[]>([
    { id: 101, name: 'Alex Johnson', email: 'alex@example.com' },
    { id: 102, name: 'Maria Garcia', email: 'maria@example.com' },
    { id: 103, name: 'Sam Wilson', email: 'sam@example.com' },
    { id: 104, name: 'Taylor Kim', email: 'taylor@example.com' },
    { id: 105, name: 'Jordan Lee', email: 'jordan@example.com' },
  ]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setInviteEmail('');
    setInviteRole('');
    setSelectedUser(null);
    setSelectedRole('');
  };

  const handleAddExistingUser = () => {
    if (!selectedUser || !selectedRole) {
      toast("Error", {
        description: "Please select a user and specify their role",
      });
      return;
    }

    onAddMember(selectedUser.email, selectedRole);
    
    toast("Team member added", {
      description: `${selectedUser.name} has been added to the project as ${selectedRole}`,
    });

    onOpenChange(false);
  };

  const handleInviteByEmail = () => {
    if (!inviteEmail || !inviteRole) {
      toast.error("Error", {
        description: "Please fill in all fields",
      });
      return;
    }

    onAddMember(inviteEmail, inviteRole);
    
    toast("Invitation sent", {
      description: `An invitation has been sent to ${inviteEmail} for the role of ${inviteRole}`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Search for existing users or invite someone by email.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="search" className="w-full mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Search Users
            </TabsTrigger>
            <TabsTrigger value="invite">
              <AtSign className="h-4 w-4 mr-2" />
              Invite by Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <SearchUserTab 
              systemUsers={systemUsers}
              selectedUser={selectedUser}
              selectedRole={selectedRole}
              onSelectUser={setSelectedUser}
              onSelectRole={setSelectedRole}
              onCancel={() => onOpenChange(false)}
              onSubmit={handleAddExistingUser}
            />
          </TabsContent>
          
          <TabsContent value="invite" className="space-y-4">
            <InviteByEmailTab 
              inviteEmail={inviteEmail} 
              inviteRole={inviteRole}
              onEmailChange={setInviteEmail}
              onRoleChange={setInviteRole}
              onCancel={() => onOpenChange(false)}
              onSubmit={handleInviteByEmail}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
