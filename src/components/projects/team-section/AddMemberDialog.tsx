
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { Loader2, AlertCircle } from 'lucide-react';
import RoleSelector from '../team/ui/RoleSelector';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember?: (member: { name: string; role: string; user_id: string }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting = false
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('team_member');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .order('full_name', { ascending: true });
          
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setError('No users found in the system');
          setUsers([]);
        } else {
          setUsers(data || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load available users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }
    
    // Use either the external isSubmitting state or the local one
    const effectiveIsSubmitting = isSubmitting !== undefined ? isSubmitting : localIsSubmitting;
    if (effectiveIsSubmitting) return;
    
    setLocalIsSubmitting(true);
    
    try {
      if (onAddMember) {
        console.log('Submitting team member with data:', {
          name,
          role,
          user_id: selectedUserId
        });
        
        const success = await onAddMember({
          name,
          role,
          user_id: selectedUserId
        });
        
        if (success) {
          resetForm();
          onOpenChange(false);
        } else {
          // If onAddMember returns false, there was an error that was already handled
          console.log('Failed to add team member, error already handled');
        }
      } else {
        setError('No handler provided for adding team member');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setRole('team_member');
    setSelectedUserId(null);
    setError(null);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    
    // Auto-fill name from selected user
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setName(selectedUser.full_name || selectedUser.username || '');
    }
  };

  // Use either the external isSubmitting state or the local one
  const effectiveIsSubmitting = isSubmitting !== undefined ? isSubmitting : localIsSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your project team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select 
              value={selectedUserId || ''} 
              onValueChange={handleUserSelect}
              disabled={isLoading || effectiveIsSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </SelectItem>
                ) : users.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No users available
                  </SelectItem>
                ) : (
                  users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.username || user.id}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <RoleSelector 
              value={role}
              onChange={setRole}
              disabled={effectiveIsSubmitting}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={effectiveIsSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={effectiveIsSubmitting || !selectedUserId}
            >
              {effectiveIsSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
