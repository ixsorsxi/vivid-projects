
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember?: (member: { name: string; role: string; user_id?: string }) => Promise<boolean>;
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
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .order('full_name', { ascending: true });
          
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load available users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }
    
    if (onAddMember) {
      const success = await onAddMember({
        name,
        role,
        user_id: selectedUserId
      });
      
      if (success) {
        handleReset();
        onOpenChange(false);
      }
    }
  };

  const handleReset = () => {
    setName('');
    setRole('team_member');
    setEmail('');
    setSelectedUserId(null);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    
    // Auto-fill name from selected user
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setName(selectedUser.full_name || selectedUser.username || '');
      setEmail(selectedUser.username || '');
    }
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
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select 
              value={selectedUserId || ''} 
              onValueChange={handleUserSelect}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading users...
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
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Member name"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={role} 
              onValueChange={setRole}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team_member">Team Member</SelectItem>
                <SelectItem value="project_manager">Project Manager</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="client_stakeholder">Client Stakeholder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !selectedUserId}
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
