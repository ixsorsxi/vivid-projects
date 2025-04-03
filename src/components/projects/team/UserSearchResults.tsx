
import React from 'react';
import { SystemUser } from './types';
import { Check } from 'lucide-react';
import Avatar from '@/components/ui/avatar.custom';

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
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto">
      <div className="space-y-1">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
              selectedUserId === String(user.id) 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex-shrink-0 mr-3">
              <Avatar 
                name={user.name} 
                src={user.avatar}
                className="h-8 w-8"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              {user.email && (
                <p className="text-xs truncate">
                  {user.email}
                </p>
              )}
            </div>
            {selectedUserId === String(user.id) && (
              <Check className="h-4 w-4 flex-shrink-0 ml-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearchResults;
