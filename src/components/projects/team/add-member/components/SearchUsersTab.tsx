
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { projectRoles } from '../../constants';
import { useSystemUsers } from '@/hooks/project-form/useSystemUsers';
import { debugLog } from '@/utils/debugLogger';
import { SystemUser } from '../../types';

interface SearchUsersTabProps {
  onSelectUser: (user: SystemUser | null) => void;
  onSelectRole: (role: string) => void;
  selectedUser: SystemUser | null;
  selectedRole: string;
  isSubmitting: boolean;
}

const SearchUsersTab: React.FC<SearchUsersTabProps> = ({
  onSelectUser,
  onSelectRole,
  selectedUser,
  selectedRole,
  isSubmitting
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, isLoading } = useSystemUsers();
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
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
                onClick={() => onSelectUser(selectedUser?.id === user.id ? null : user)}
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
          <Select value={selectedRole} onValueChange={onSelectRole}>
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
  );
};

export default SearchUsersTab;
