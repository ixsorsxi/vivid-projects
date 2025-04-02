
import React from 'react';
import { Check, User } from 'lucide-react';
import { SystemUser } from './types';

interface UserSearchResultsProps {
  users: SystemUser[];
  selectedUserId: string | null;
  onSelectUser: (user: SystemUser) => void;
  isLoading?: boolean;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Searching for users...</p>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center p-3 rounded-md border animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted mr-3" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 border rounded-md bg-muted/20">
        <p className="text-sm text-muted-foreground text-center">
          No users found. Try a different search or add a team member manually.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {users.map(user => {
        // Convert both to strings to ensure consistent comparison
        const isSelected = selectedUserId !== null && String(selectedUserId) === String(user.id);
        
        return (
          <div
            key={user.id}
            className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
              isSelected 
                ? 'border-primary bg-primary/10' 
                : 'hover:bg-accent'
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
            {isSelected && (
              <div className="flex-shrink-0">
                <Check className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserSearchResults;
