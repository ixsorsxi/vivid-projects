
import React from 'react';
import { SystemUser } from './types';

interface UserSearchResultsProps {
  users: SystemUser[];
  selectedUserId: string | null;
  onSelectUser: (user: SystemUser) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ 
  users, 
  selectedUserId, 
  onSelectUser,
  isLoading = false,
  disabled = false
}) => {
  return (
    <div className="max-h-60 overflow-y-auto border rounded-md">
      {isLoading ? (
        <div className="p-4 text-center text-muted-foreground">
          Loading users...
        </div>
      ) : users.length > 0 ? (
        users.map(user => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 hover:bg-muted cursor-pointer ${
              selectedUserId === String(user.id) ? 'bg-muted' : ''
            } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => !disabled && onSelectUser(user)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No matching users found
        </div>
      )}
    </div>
  );
};

export default UserSearchResults;
