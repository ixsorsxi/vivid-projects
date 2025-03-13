
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast-wrapper";
import { Search, Mail, AtSign } from 'lucide-react';
import { SystemUser } from './types';
import UserSearchResults from './UserSearchResults';

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
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('');

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
    setSearchQuery('');
    setSelectedUser(null);
    setSelectedRole('');
  };

  const filteredUsers = systemUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div>
              <Label htmlFor="search-user">Search Users</Label>
              <Input
                id="search-user"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            
            <UserSearchResults 
              users={filteredUsers} 
              selectedUserId={selectedUser?.id}
              onSelectUser={setSelectedUser}
            />
            
            <div>
              <Label htmlFor="role">Assign Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                  <SelectItem value="Product Owner">Product Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExistingUser}>
                Add to Project
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="invite" className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                prefix={<Mail className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                  <SelectItem value="Product Owner">Product Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteByEmail}>
                Send Invitation
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
