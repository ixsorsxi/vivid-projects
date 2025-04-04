
import React from 'react';
import { SystemUser } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { debugLog } from '@/utils/debugLogger';

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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found. Try a different search term.
      </div>
    );
  }

  const handleSelectUser = (user: SystemUser) => {
    debugLog('UserSearchResults', 'User selected:', user.id, user.name);
    onSelectUser(user);
  };

  return (
    <ScrollArea className="h-[200px] border rounded-md">
      <div className="p-1">
        {users.map((user) => (
          <button
            key={user.id}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-left ${
              selectedUserId === String(user.id) ? 'bg-accent' : ''
            }`}
            onClick={() => handleSelectUser(user)}
            disabled={disabled}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
            <div className="text-xs px-2 py-1 bg-accent-foreground/10 rounded-full">
              {user.role}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default UserSearchResults;
