
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search } from 'lucide-react';
import { toast } from '@/components/ui/toast-wrapper';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMember: (member: { name: string; role: string; user_id?: string }) => Promise<boolean>;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [role, setRole] = useState('Team Member');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<{id: string, name: string, email: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingMembers, setExistingMembers] = useState<string[]>([]);

  // Fetch users and existing team members when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchExistingMembers();
    } else {
      // Clear form when closed
      setSearchQuery('');
      setSelectedUserId('');
      setSelectedUserName('');
      setRole('Team Member');
    }
  }, [open, projectId]);

  const fetchExistingMembers = async () => {
    if (!projectId) return;
    
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId)
        .is('left_at', null);
        
      if (error) throw error;
      
      // Extract user IDs
      const memberIds = data.map(member => member.user_id).filter(Boolean);
      setExistingMembers(memberIds);
    } catch (error) {
      console.error('Error fetching existing team members:', error);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .order('full_name');
        
      if (error) throw error;

      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.full_name || user.username || 'Unknown User',
        email: user.username || ''
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: {id: string, name: string}) => {
    setSelectedUserId(user.id);
    setSelectedUserName(user.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserName || !selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    // Check if user is already a team member
    if (existingMembers.includes(selectedUserId)) {
      toast.error('User is already a team member of this project');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use the onAddMember prop to handle the database insertion
      const success = await onAddMember({ 
        name: selectedUserName, 
        role,
        user_id: selectedUserId
      });
      
      if (success) {
        // Reset form and close dialog
        setSearchQuery('');
        setSelectedUserId('');
        setSelectedUserName('');
        setRole('Team Member');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    // Skip users who are already team members
    if (existingMembers.includes(user.id)) return false;
    
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="border rounded-md max-h-[200px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {searchQuery ? 'No users found matching your search' : 'No users available'}
              </p>
            ) : (
              <div className="space-y-1 p-1">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-secondary ${
                      selectedUserId === user.id ? 'bg-secondary' : ''
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={setRole}
              disabled={isSubmitting}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Team Member">Team Member</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedUserId}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
