
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SystemUser } from '../types';
import UserSearchResults from '../UserSearchResults';

// Consistent role options across the application
const ROLE_OPTIONS = [
  'Project Manager',
  'Developer',
  'Designer',
  'QA Engineer',
  'Business Analyst',
  'Product Owner',
  'Team Member'
];

interface SearchUserTabProps {
  systemUsers: SystemUser[];
  selectedUser: SystemUser | null;
  selectedRole: string;
  onSelectUser: (user: SystemUser | null) => void;
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
    <>
      <div className="space-y-4">
        <UserSearchResults 
          users={systemUsers}
          selectedUserId={selectedUser?.id ? String(selectedUser.id) : undefined}
          onSelectUser={onSelectUser}
          isLoading={isLoading}
        />
        
        {selectedUser && (
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={onSelectRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit} 
          disabled={!selectedUser}
        >
          Add Member
        </Button>
      </div>
    </>
  );
};

export default SearchUserTab;
