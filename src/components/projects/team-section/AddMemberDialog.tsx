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
import { debugLog, debugError } from '@/utils/debugLogger';

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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        debugLog('AddMemberDialog', 'Fetching available users');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .order('full_name', { ascending: true });
          
        if (error) {
          debugError('AddMemberDialog', 'Error fetching users:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          setError('No users found in the system');
          setUsers([]);
        } else {
          debugLog('AddMemberDialog', `Fetched ${data.length} users`);
          setUsers(data || []);
        }
      } catch (error) {
        debugError('AddMemberDialog', 'Error fetching users:', error);
        setError('Failed to load available users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [open, retryCount]);

  const formatRoleKey = (roleStr: string): string => {
    return roleStr.toLowerCase().replace(/[\s-]+/g, '_');
  };

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
    
    const effectiveIsSubmitting = isSubmitting !== undefined ? isSubmitting : localIsSubmitting;
    if (effectiveIsSubmitting) return;
    
    setLocalIsSubmitting(true);
    
    try {
      const formattedRole = formatRoleKey(role);
      
      debugLog('AddMemberDialog', 'Submitting new team member:', { 
        name, role: formattedRole, user_id: selectedUserId, project_id: projectId
      });
      
      if (onAddMember) {
        const success = await onAddMember({
          name,
          role: formattedRole,
          user_id: selectedUserId
        });
        
        if (success) {
          debugLog('AddMemberDialog', 'Successfully added team member');
          toast.success('Team member added', {
            description: `${name} has been added to the project team`
          });
          resetForm();
          onOpenChange(false);
        } else {
          debugError('AddMemberDialog', 'Failed to add team member');
          setError('Failed to add team member. Please try again.');
        }
      } else {
        setError('No handler provided for adding team member');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      debugError('AddMemberDialog', 'Error adding team member:', errorMessage);
      
      if (errorMessage.includes('already a member')) {
        setError('This user is already a member of the project');
      } else if (errorMessage.includes('Permission denied')) {
        setError('You do not have permission to add members to this project');
      } else if (errorMessage.includes('violates row-level security')) {
        setError('Access denied. Try refreshing the page or check your permissions.');
      } else {
        setError(errorMessage);
      }
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

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setName(selectedUser.full_name || selectedUser.username || '');
    }
  };

  const effectiveIsSubmitting = isSubmitting !== undefined ? isSubmitting : localIsSubmitting;

  const handleRetryUserLoad = () => {
    setRetryCount(prev => prev + 1);
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
                  <div className="p-2">
                    <p className="text-sm text-muted-foreground mb-2">No users available</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleRetryUserLoad}
                    >
                      Retry
                    </Button>
                  </div>
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
