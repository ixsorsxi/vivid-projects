import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import RoleSelector from '../ui/RoleSelector';

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
            <select
              id="user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isLoading || users.length === 0 || isFormSubmitting}
              className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {isLoading && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Loading users...
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <RoleSelector
              value={selectedRole}
              onChange={setSelectedRole}
              disabled={isFormSubmitting}
            />
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
            <Button type="submit" disabled={isFormSubmitting || !selectedUserId}>
              {isFormSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </span>
              ) : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
