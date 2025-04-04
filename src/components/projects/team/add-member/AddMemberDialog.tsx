import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import { SystemUser } from '../types';
import { useTeamMemberAddition } from '../hooks/useTeamMemberAddition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { projectRoles } from '../constants';
import { debugLog, debugError } from '@/utils/debugLogger';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  onAddMember?: (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMember,
  isSubmitting: externalIsSubmitting = false
}) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'email'>('existing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('Team Member');
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { users, isLoading } = useSystemUsers();
  
  // Use our custom hook for adding team members
  const {
    isSubmitting: internalIsSubmitting,
    addTeamMember
  } = useTeamMemberAddition(projectId);
  
  // Use external or internal submitting state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form state
    setSelectedUser(null);
    setSearchQuery('');
    setSelectedRole('Team Member');
    setInviteEmail('');
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    let success = false;
    
    try {
      if (activeTab === 'existing' && selectedUser) {
        debugLog('AddMemberDialog', 'Adding existing user:', selectedUser);
        
        if (onAddMember) {
          // Use provided onAddMember callback if available
          success = await onAddMember({
            name: selectedUser.name,
            role: selectedRole,
            email: selectedUser.email,
            user_id: String(selectedUser.id)
          });
        } else {
          // Otherwise use our internal implementation
          success = await addTeamMember({
            name: selectedUser.name,
            role: selectedRole,
            email: selectedUser.email,
            user_id: String(selectedUser.id)
          });
        }
      } else if (activeTab === 'email' && inviteEmail) {
        debugLog('AddMemberDialog', 'Adding by email:', inviteEmail);
        
        if (onAddMember) {
          // Use provided onAddMember callback if available
          success = await onAddMember({
            name: inviteEmail.split('@')[0],
            role: selectedRole,
            email: inviteEmail
          });
        } else {
          // Otherwise use our internal implementation
          success = await addTeamMember({
            name: inviteEmail.split('@')[0],
            role: selectedRole,
            email: inviteEmail
          });
        }
      } else {
        setError('Please select a user or enter an email address');
        return;
      }
      
      if (success) {
        handleCancel(); // Close dialog and reset form on success
      }
    } catch (error) {
      debugError('AddMemberDialog', 'Error in handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'Failed to add team member');
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project Team Member</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add a new member to your project team.
          </p>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            type="button"
            variant={activeTab === 'existing' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => setActiveTab('existing')}
          >
            Search Users
          </Button>
          <Button
            type="button"
            variant={activeTab === 'email' ? 'default' : 'outline'} 
            className="w-full"
            onClick={() => setActiveTab('email')}
          >
            Invite by Email
          </Button>
        </div>
        
        {activeTab === 'existing' ? (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="border rounded-md max-h-[200px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading users...</span>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="divide-y">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-3 flex items-center justify-between cursor-pointer hover:bg-muted ${
                        selectedUser?.id === user.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="bg-secondary/50 text-xs px-2 py-1 rounded">
                        {user.role || 'user'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery ? 'No users found' : 'Type to search for users'}
                </div>
              )}
            </div>
            
            {selectedUser && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Project Role for {selectedUser.name}
                </h4>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: This is separate from their system role ({selectedUser.role || 'user'})
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Project Role
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {projectRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {projectId && (
          <div className="text-xs text-muted-foreground border border-muted rounded px-2 py-1 mt-2">
            Project ID: {projectId}
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !(selectedUser || inviteEmail)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Team Member"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
