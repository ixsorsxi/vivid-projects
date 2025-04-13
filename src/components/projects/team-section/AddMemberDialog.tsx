
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { debugLog, debugError } from '@/utils/debugLogger';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember: (member: { name: string; role: string; email?: string; user_id: string }) => Promise<boolean>;
  isSubmitting: boolean;
}

const roleOptions = [
  { value: 'team_member', label: 'Team Member' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'tester', label: 'Tester' },
  { value: 'stakeholder', label: 'Stakeholder' }
];

interface SystemUser {
  id: string;
  name: string;
  email?: string;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting
}) => {
  const [role, setRole] = useState('team_member');
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<SystemUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSystemUsers();
    } else {
      // Reset form when dialog closes
      setRole('team_member');
      setFormError('');
      setSearchQuery('');
      setSelectedUser(null);
    }
  }, [open]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(systemUsers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = systemUsers.filter(user => {
      return (
        user.name.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
    });

    setFilteredUsers(filtered);
  }, [systemUsers, searchQuery]);

  const fetchSystemUsers = async () => {
    setIsLoadingUsers(true);
    try {
      debugLog('AddMemberDialog', 'Fetching system users');
      
      // Fetch users from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .order('full_name', { ascending: true });
      
      if (error) throw error;

      // Map to our format
      const users: SystemUser[] = data.map(user => ({
        id: user.id,
        name: user.full_name || user.username || 'Unnamed User',
        email: user.username
      }));
      
      debugLog('AddMemberDialog', `Fetched ${users.length} system users`);
      setSystemUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      debugError('AddMemberDialog', 'Error fetching users:', error);
      setFormError('Failed to load users. Please try again.');
      toast.error('Error loading users', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSelectUser = (user: SystemUser) => {
    setSelectedUser(user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      if (!selectedUser) {
        setFormError('Please select a user');
        return;
      }

      // Format role to ensure it matches expected DB format (snake_case)
      const formattedRole = role.toLowerCase().replace(/[\s-]+/g, '_');
      
      debugLog('AddMemberDialog', 'Submitting selected user:', {
        name: selectedUser.name,
        email: selectedUser.email,
        role: formattedRole,
        userId: selectedUser.id
      });

      const success = await onAddMember({
        name: selectedUser.name,
        role: formattedRole,
        email: selectedUser.email,
        user_id: selectedUser.id
      });

      if (success) {
        debugLog('AddMemberDialog', 'Member added successfully');
        onOpenChange(false);
      }
    } catch (error) {
      debugError('AddMemberDialog', 'Error adding member:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to add member');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add an existing user to your project team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Loading users...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No users found matching "{searchQuery}"
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto border rounded-md">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-3 border-b flex items-center cursor-pointer hover:bg-accent ${
                        selectedUser?.id === user.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        {user.email && (
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedUser && (
                <div className="p-3 border rounded-md bg-accent/30">
                  <div className="font-medium">Selected: {selectedUser.name}</div>
                  {selectedUser.email && (
                    <div className="text-xs text-muted-foreground">{selectedUser.email}</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    {roleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {formError && (
              <div className="text-sm font-medium text-destructive">{formError}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedUser}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
