import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';

interface SystemUser {
  id: string;
  name: string;
  email: string;
}

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onAddSuccess?: () => void;
  onAddMember?: (member: any) => Promise<boolean>;
  isSubmitting?: boolean;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddSuccess,
  onAddMember,
  isSubmitting: externalIsSubmitting
}) => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('team_member');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available users when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
    } else {
      // Reset form when closed
      setSelectedUserId('');
      setSelectedRole('team_member');
    }
  }, [open]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .order('full_name', { ascending: true });

      if (error) throw error;

      // Map to our SystemUser format
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.full_name || user.username || 'Unnamed User',
        email: user.username
      }));

      console.log('Available users:', formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Find the selected user details
      const selectedUser = users.find(user => user.id === selectedUserId);
      if (!selectedUser) {
        throw new Error('Selected user not found');
      }

      // If onAddMember prop is provided, use it
      if (onAddMember) {
        const success = await onAddMember({
          name: selectedUser.name,
          role: selectedRole,
          user_id: selectedUserId,
          email: selectedUser.email
        });

        if (success) {
          toast.success('Team member added successfully');
          onOpenChange(false);
          if (onAddSuccess) onAddSuccess();
        } else {
          throw new Error('Failed to add team member');
        }
        return;
      }

      // Otherwise, use direct Supabase insert (fallback method)
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      // First, check if user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', selectedUserId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingMember) {
        toast.error('This user is already a member of this project');
        return;
      }

      // Insert new member directly
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: selectedUserId,
          role: selectedRole,
          project_member_name: selectedUser.name
        });

      if (error) {
        // If direct insert fails, try using RPC function
        console.log('Attempting to use RPC function for member addition');
        const { error: rpcError } = await supabase.rpc('add_project_member', {
          p_project_id: projectId,
          p_user_id: selectedUserId,
          p_name: selectedUser.name,
          p_role: selectedRole,
          p_email: selectedUser.email
        });
        
        if (rpcError) throw rpcError;
      }

      toast.success('Team member added successfully');
      onOpenChange(false);
      if (onAddSuccess) onAddSuccess();
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use external isSubmitting state if provided
  const isFormSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a team member to this project. They will have access based on their assigned role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={isLoading || users.length === 0 || isFormSubmitting}
            >
              <SelectTrigger id="user" className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
                {users.length === 0 && (
                  <SelectItem value="no-users" disabled>
                    {isLoading ? 'Loading users...' : 'No users available'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={isFormSubmitting}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project_manager">Project Manager</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="client_stakeholder">Client/Stakeholder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isFormSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isFormSubmitting}>
              {isFormSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
