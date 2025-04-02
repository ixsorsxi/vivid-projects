
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserSearchResults from '../UserSearchResults';
import { SystemUser } from '../types';

interface SearchUserTabProps {
  systemUsers: SystemUser[];
  selectedUser: SystemUser | null;
  selectedRole: string;
  onSelectUser: (user: SystemUser) => void;
  onSelectRole: (role: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const SearchUserTab: React.FC<SearchUserTabProps> = ({
  systemUsers,
  selectedUser,
  selectedRole,
  onSelectUser,
  onSelectRole,
  onCancel,
  onSubmit,
  isLoading = false
}) => {
  return (
    <div className="space-y-4">
      <div className="mb-5">
        <UserSearchResults 
          users={systemUsers}
          selectedUserId={selectedUser ? String(selectedUser.id) : null}
          onSelectUser={onSelectUser}
          isLoading={isLoading}
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!selectedUser || !selectedRole}
        >
          Add Team Member
        </Button>
      </div>
    </div>
  );
};

export default SearchUserTab;
