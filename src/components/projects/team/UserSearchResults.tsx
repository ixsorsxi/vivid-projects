
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { SystemUser } from './types';
import { Check } from 'lucide-react';

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
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center p-2 rounded-md border">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-3 space-y-1 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No users found matching your search
      </div>
    );
  }

  return (
    <div className="max-h-48 overflow-y-auto space-y-1">
      {users.map(user => {
        const isSelected = selectedUserId === String(user.id);
        
        return (
          <button
            key={user.id}
            className={cn(
              "w-full flex items-center p-2 rounded-md text-left hover:bg-gray-100",
              "transition-colors duration-150 relative",
              isSelected && "bg-blue-50 hover:bg-blue-50",
              "border border-gray-200",
              disabled && "opacity-60 cursor-not-allowed",
            )}
            onClick={() => !disabled && onSelectUser(user)}
            disabled={disabled}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            {isSelected && (
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-blue-500" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default UserSearchResults;
