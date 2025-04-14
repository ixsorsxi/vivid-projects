
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

interface User {
  id: string;
  full_name: string;
}

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember: (userId: string, role: string) => Promise<boolean>;
}

const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  // Fetch available users when the dialog opens
  useEffect(() => {
    if (open) {
      fetchAvailableUsers();
    }
  }, [open, projectId]);

  const fetchAvailableUsers = async () => {
    setIsFetchingUsers(true);
    try {
      // Fetch all users who are not already members of this project
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
        
      if (error) {
        throw error;
      }
      
      // Fetch current project members to exclude them
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId);
        
      if (membersError) {
        throw membersError;
      }
      
      // Filter out users who are already members
      const memberUserIds = members.map(m => m.user_id);
      const availableUsers = profiles.filter(user => !memberUserIds.includes(user.id));
      
      setUsers(availableUsers);
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast.error('Failed to load available users');
    } finally {
      setIsFetchingUsers(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await onAddMember(selectedUserId, selectedRole);
      if (success) {
        onOpenChange(false);
        setSelectedUserId('');
        setSelectedRole('member');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new team member to your project.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              User
            </Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={isFetchingUsers}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.length === 0 && !isFetchingUsers && (
                  <SelectItem value="no-users" disabled>
                    No available users found
                  </SelectItem>
                )}
                {isFetchingUsers && (
                  <SelectItem value="loading" disabled>
                    Loading users...
                  </SelectItem>
                )}
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMember} 
            disabled={!selectedUserId || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
