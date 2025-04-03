
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserSearchResults from '../UserSearchResults';
import { SystemUser } from '../types';
import { Loader2 } from 'lucide-react';

interface SearchUserTabProps {
  systemUsers: SystemUser[];
  selectedUser: SystemUser | null;
  selectedRole: string;
  onSelectUser: (user: SystemUser) => void;
  onSelectRole: (role: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

const SearchUserTab: React.FC<SearchUserTabProps> = ({
  systemUsers,
  selectedUser,
  selectedRole,
  onSelectUser,
  onSelectRole,
  onCancel,
  onSubmit,
  isLoading = false,
  isSubmitting = false
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-5">
        <UserSearchResults 
          users={systemUsers}
          selectedUserId={selectedUser ? String(selectedUser.id) : null}
          onSelectUser={onSelectUser}
          isLoading={isLoading}
          disabled={isSubmitting}
        />
      </div>

      {selectedUser && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Role for {selectedUser.name}
          </label>
          <Select 
            value={selectedRole} 
            onValueChange={onSelectRole}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Team Member">Team Member</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Designer">Designer</SelectItem>
              <SelectItem value="Project Manager">Project Manager</SelectItem>
              <SelectItem value="QA Engineer">QA Engineer</SelectItem>
              <SelectItem value="UX Researcher">UX Researcher</SelectItem>
              <SelectItem value="Product Owner">Product Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
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
