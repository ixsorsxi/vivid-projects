
import React from 'react';
import { SystemUser } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

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
      <div className="flex justify-center items-center py-8 border rounded-md">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] border rounded-md">
      <div className="p-1">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-3 rounded-md cursor-pointer ${
              selectedUserId === String(user.id)
                ? 'bg-primary/10 border-primary'
                : 'hover:bg-muted/50'
            } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => !disabled && onSelectUser(user)}
          >
            <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email || ''}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default UserSearchResults;
