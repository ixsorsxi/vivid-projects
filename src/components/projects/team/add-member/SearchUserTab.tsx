
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { projectRoles } from '../constants';
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import { debugLog } from '@/utils/debugLogger';

export interface SearchUserTabProps {
  projectId?: string;
  onAddMember: (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => Promise<boolean>;
  isSubmitting?: boolean;
}

const SearchUserTab: React.FC<SearchUserTabProps> = ({ 
  projectId, 
  onAddMember, 
  isSubmitting = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Team Member');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  
  // Use the existing hook to fetch system users
  const { users, isLoading } = useSystemUsers();
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    debugLog('SearchUserTab', 'Searching for users with query:', query);
  };

  const handleSelectUser = (userId: string, userName: string, userEmail: string) => {
    debugLog('SearchUserTab', 'Selected user:', userId, userName);
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSelectedUserEmail(userEmail);
  };

  const handleAddMemberClick = async () => {
    if (!selectedUserId) {
      alert('Please select a user to add.');
      return;
    }

    const member = {
      user_id: selectedUserId,
      name: selectedUserName,
      role: selectedRole,
      email: selectedUserEmail
    };

    try {
      debugLog('SearchUserTab', 'Adding member:', member);
      const success = await onAddMember(member);
      
      // Reset state after successful add
      if (success) {
        setSearchQuery('');
        setSelectedUserId(null);
        setSelectedUserName('');
        setSelectedUserEmail('');
        setSelectedRole('Team Member');
      }
    } catch (error) {
      debugLog('SearchUserTab', 'Error adding member:', error);
      // The onAddMember function should handle displaying the error message
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="search"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      )}

      {!isLoading && searchQuery && filteredUsers.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">No users found.</p>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <ul className="space-y-2 max-h-[200px] overflow-y-auto">
          {filteredUsers.map(user => (
            <li
              key={user.id}
              className={`p-2 rounded-md cursor-pointer hover:bg-secondary ${selectedUserId === String(user.id) ? 'bg-secondary' : ''}`}
              onClick={() => handleSelectUser(String(user.id), user.name, user.email || '')}
            >
              {user.name} ({user.email || 'No email'})
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Project Role
        </label>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger id="role" className="w-full">
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

      <Button 
        onClick={handleAddMemberClick} 
        disabled={!selectedUserId || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            Adding...
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          'Add to Project'
        )}
      </Button>
    </div>
  );
};

export default SearchUserTab;
