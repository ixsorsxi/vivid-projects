
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteByEmailTab from './InviteByEmailTab';
import SearchUserTab from './SearchUserTab';
import { SystemUser } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  isSubmitting = false
}) => {
  const [activeTab, setActiveTab] = useState('search');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Team Member'); // Default project role, not system role
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('Team Member'); // Default project role, not system role
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const { user } = useAuth();

  // Filter users based on search query
  const filteredUsers = systemUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Load actual system users from profiles table
  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;
      
      setIsLoading(true);
      try {
        console.log('[DIALOG] Fetching users...');
        
        // Try to get all profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, role');

        if (error) {
          console.error('[DIALOG] Error fetching users:', error);
          toast.error("Error loading users", {
            description: "Could not load system users. Please try again."
          });
          return;
        }

        if (data) {
          const users: SystemUser[] = data.map(user => ({
            id: user.id,
            name: user.full_name || user.username || 'Unnamed User',
            email: user.username || '',
            role: user.role || 'User', // This is the system role, not project role
            avatar: user.avatar_url || '/placeholder.svg'
          }));
          setSystemUsers(users);
          console.log('[DIALOG] Loaded system users:', users.length);
        }
      } catch (err) {
        console.error('[DIALOG] Error fetching users:', err);
        toast.error("Error loading users", {
          description: "An unexpected error occurred while loading users."
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleAddMember = async () => {
    if (localSubmitting || isSubmitting) return;
    
    setLocalSubmitting(true);
    
    try {
      console.log('[DIALOG] Starting member addition process...');
      
      if (activeTab === 'invite') {
        if (!inviteEmail) {
          toast.error("Error", {
            description: "Please enter an email address",
          });
          setLocalSubmitting(false);
          return;
        }

        console.log('[DIALOG] Adding member by email with project role:', inviteRole);
        
        // For invite by email, create a new member with the email
        if (onAddMember) {
          const success = await onAddMember({
            name: inviteEmail.split('@')[0], // Use part of email as name
            role: inviteRole, // This is the project role we're assigning
            email: inviteEmail
          });
          
          console.log('[DIALOG] Email invitation result:', success);
          
          if (success) {
            setInviteEmail('');
            toast.success("Team member invited", {
              description: `Invitation has been sent to ${inviteEmail}`
            });
            onOpenChange(false);
          } else {
            toast.error("Failed to add team member", {
              description: "There was an error adding the team member. Please try again."
            });
          }
        }
      } else {
        if (!selectedUser) {
          toast.error("Error", {
            description: "Please select a user",
          });
          setLocalSubmitting(false);
          return;
        }

        console.log('[DIALOG] Adding selected user:', selectedUser);
        console.log('[DIALOG] With project role (not system role):', selectedRole);
        
        // For user selection, create a member with the selected user
        if (onAddMember) {
          const memberData = {
            name: selectedUser.name,
            role: selectedRole, // This is the project role we're assigning, not their system role
            email: selectedUser.email,
            user_id: String(selectedUser.id) // Ensure user_id is passed as a string
          };
          
          console.log('[DIALOG] Sending member data to parent:', memberData);
          
          const success = await onAddMember(memberData);
          
          console.log('[DIALOG] User addition result:', success);
          
          if (success) {
            setSelectedUser(null);
            setSelectedRole('Team Member');
            toast.success("Team member added", {
              description: `${selectedUser.name} has been added to the team`
            });
            onOpenChange(false);
          } else {
            toast.error("Failed to add team member", {
              description: "There was an error adding the team member. Please try again."
            });
          }
        }
      }
    } catch (error) {
      console.error('[DIALOG] Error adding member:', error);
      toast.error("Error adding team member", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setLocalSubmitting(false);
    }
  };

  // Reset form state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedUser(null);
      setSelectedRole('Team Member');
      setInviteEmail('');
      setInviteRole('Team Member');
      setSearchQuery('');
      setLocalSubmitting(false);
    }
  }, [open]);

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
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <SearchUserTab
              systemUsers={filteredUsers}
              selectedUser={selectedUser}
              selectedRole={selectedRole}
              onSelectUser={setSelectedUser}
              onSelectRole={setSelectedRole}
              onCancel={() => onOpenChange(false)}
              onSubmit={handleAddMember}
              isLoading={isLoading}
              isSubmitting={localSubmitting || isSubmitting}
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
              isSubmitting={localSubmitting || isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
