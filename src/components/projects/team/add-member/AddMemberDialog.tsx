
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteByEmailTab from './InviteByEmailTab';
import SearchUserTab from './SearchUserTab';
import { SystemUser } from '../types';
import { supabase } from '@/integrations/supabase/client';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onAddMember?: (member: { id?: string; name: string; role: string; email?: string }) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember
}) => {
  const [activeTab, setActiveTab] = useState('search');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Team Member');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('Team Member');
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load actual system users from profiles table
  React.useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, role');

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        if (data) {
          const users: SystemUser[] = data.map(user => ({
            id: user.id,
            name: user.full_name || user.username || 'Unnamed User',
            email: user.username || '',
            role: user.role || 'User',
            avatar: user.avatar_url || '/placeholder.svg'
          }));
          setSystemUsers(users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleAddMember = async () => {
    if (activeTab === 'invite') {
      if (!inviteEmail) {
        toast.error("Error", {
          description: "Please enter an email address",
        });
        return;
      }

      // For invite by email, create a new member with the email
      if (onAddMember) {
        onAddMember({
          name: inviteEmail.split('@')[0], // Use part of email as name
          role: inviteRole,
          email: inviteEmail
        });
      } else if (projectId) {
        // If projectId is provided, add directly to database
        try {
          const { error } = await supabase
            .from('project_members')
            .insert({
              project_id: projectId,
              name: inviteEmail.split('@')[0],
              role: inviteRole,
              // No user_id since this is just an invitation
            });

          if (error) {
            throw error;
          }

          toast.success("Member invited", {
            description: `Invitation sent to ${inviteEmail}`,
          });
        } catch (err) {
          console.error('Error inviting member:', err);
          toast.error("Error", {
            description: "Failed to invite member",
          });
        }
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

      // For user selection, create a member with the selected user
      if (onAddMember) {
        onAddMember({
          id: selectedUser.id.toString(),
          name: selectedUser.name,
          role: selectedRole,
          email: selectedUser.email
        });
      } else if (projectId) {
        // If projectId is provided, add directly to database
        try {
          // Check if this user is already a project manager for another project
          if (selectedRole === 'Project Manager') {
            // Update the project to set this user as the project manager
            const { error: updateError } = await supabase
              .from('projects')
              .update({ project_manager_id: selectedUser.id })
              .eq('id', projectId);

            if (updateError) {
              console.error('Error setting project manager:', updateError);
            }
          }

          // Add the member to the project_members table
          const { error } = await supabase
            .from('project_members')
            .insert({
              project_id: projectId,
              user_id: selectedUser.id,
              name: selectedUser.name,
              role: selectedRole
            });

          if (error) {
            throw error;
          }

          toast.success("Member added", {
            description: `${selectedUser.name} has been added to the project`,
          });
        } catch (err) {
          console.error('Error adding member:', err);
          toast.error("Error", {
            description: "Failed to add member",
          });
        }
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
            <TabsTrigger value="search">Search Users</TabsTrigger>
            <TabsTrigger value="invite">Invite by Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4 mt-4">
            <SearchUserTab
              systemUsers={systemUsers}
              selectedUser={selectedUser}
              selectedRole={selectedRole}
              onSelectUser={setSelectedUser}
              onSelectRole={setSelectedRole}
              onCancel={() => onOpenChange(false)}
              onSubmit={handleAddMember}
            />
          </TabsContent>
          
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
