
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('team_member');
  const [userId, setUserId] = useState(''); // For development testing
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('team_member');
    setUserId('');
    setFormError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      if (!name.trim()) {
        setFormError('Name is required');
        return;
      }

      // In a real app, we'd look up the user ID by email
      // For demo purposes, we'll use a test user ID if provided, or generate one
      const memberUserId = userId.trim() || `user-${Date.now()}`;
      
      // Format role to ensure it matches expected DB format (snake_case)
      const formattedRole = role.toLowerCase().replace(/[\s-]+/g, '_');
      
      debugLog('AddMemberDialog', 'Submitting member:', {
        name,
        email,
        role: formattedRole,
        userId: memberUserId
      });

      const success = await onAddMember({
        name,
        role: formattedRole,
        email: email || undefined,
        user_id: memberUserId
      });

      if (success) {
        debugLog('AddMemberDialog', 'Member added successfully');
        handleClose();
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
              Add a new member to your project team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
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
            <div className="space-y-2">
              <Label htmlFor="userId">User ID (for testing)</Label>
              <Input
                id="userId"
                placeholder="User ID (optional for testing)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For development only. Leave blank in production.
              </p>
            </div>
            {formError && (
              <div className="text-sm font-medium text-destructive">{formError}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
