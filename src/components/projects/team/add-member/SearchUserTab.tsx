
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserSearchResults from '../UserSearchResults';
import { SystemUser } from '../types';
import { Loader2 } from 'lucide-react';
import { projectRoles } from '../constants';
import { debugLog } from '@/utils/debugLogger';
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';

interface SearchUserTabProps {
  projectId?: string;
  onAddMember?: (member: { name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const SearchUserTab: React.FC<SearchUserTabProps> = ({
  onAddMember,
  isSubmitting = false,
  projectId
}) => {
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('Team Member');
  const { users, isLoading } = useSystemUsers();

  const handleRoleChange = (newRole: string) => {
    debugLog('SearchUserTab', 'Role changed to:', newRole);
    setSelectedRole(newRole);
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setSelectedRole('Team Member');
  };

  const handleSubmit = async () => {
    if (!selectedUser || !selectedRole || !onAddMember) return;
    
    debugLog('SearchUserTab', 'Submitting with user:', selectedUser.name, 'and role:', selectedRole);
    
    try {
      await onAddMember({
        name: selectedUser.name,
        role: selectedRole,
        email: selectedUser.email,
        user_id: String(selectedUser.id)
      });
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-5">
        <UserSearchResults 
          users={users || []}
          selectedUserId={selectedUser ? String(selectedUser.id) : null}
          onSelectUser={(user) => {
            debugLog('SearchUserTab', 'User selected:', user);
            setSelectedUser(user);
          }}
          isLoading={isLoading}
          disabled={isSubmitting}
        />
      </div>

      {selectedUser && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Role for {selectedUser.name}
          </label>
          <Select 
            value={selectedRole} 
            onValueChange={handleRoleChange}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project role" />
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
            Note: This is separate from their system role ({selectedUser.role || 'User'})
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={() => {
            debugLog('SearchUserTab', 'Submit clicked with user:', selectedUser?.name, 'and role:', selectedRole);
            handleSubmit();
          }}
          disabled={!selectedUser || !selectedRole || isSubmitting}
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
    </div>
  );
};

export default SearchUserTab;
