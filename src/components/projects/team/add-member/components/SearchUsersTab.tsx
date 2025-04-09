
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SystemUser } from '../../types';
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import UserSearchResults from '../../UserSearchResults';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { debugLog } from '@/utils/debugLogger';

interface SearchUsersTabProps {
  onSelectUser: (user: SystemUser | null) => void;
  onSelectRole: (role: string) => void;
  selectedUser: SystemUser | null;
  selectedRole: string;
  isSubmitting?: boolean;
}

const SearchUsersTab: React.FC<SearchUsersTabProps> = ({ 
  onSelectUser, 
  onSelectRole, 
  selectedUser, 
  selectedRole,
  isSubmitting = false 
}) => {
  const { users, isLoading } = useSystemUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<SystemUser[]>([]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => {
      return (
        user.name.toLowerCase().includes(query) || 
        (user.email && user.email.toLowerCase().includes(query))
      );
    });
    
    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  const handleUserSelect = (user: SystemUser) => {
    debugLog('SearchUsersTab', 'User selected:', user);
    // Make sure we're passing the whole user object
    onSelectUser(user);
  };

  const handleRoleChange = (value: string) => {
    debugLog('SearchUsersTab', 'Role selected:', value);
    onSelectRole(value);
  };

  // Add this search input change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search for users..." 
          className="pl-9" 
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={isSubmitting}
        />
      </div>
      
      <UserSearchResults
        users={filteredUsers}
        selectedUserId={selectedUser?.id ? String(selectedUser.id) : null}
        onSelectUser={handleUserSelect}
        isLoading={isLoading}
        disabled={isSubmitting}
      />
      
      <div className="mt-4">
        <Label htmlFor="role">Role</Label>
        <Select
          value={selectedRole}
          onValueChange={handleRoleChange}
          disabled={isSubmitting}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team_member">Team Member</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="observer_viewer">Observer / Viewer</SelectItem>
            <SelectItem value="client_stakeholder">Client / Stakeholder</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchUsersTab;
