
import React, { useState } from 'react';
import { SystemUser } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { systemRoleVariants } from './constants';

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
  // Get badge variant based on user's system role
  const getBadgeVariant = (role?: string) => {
    if (!role) return "outline";
    return systemRoleVariants[role.toLowerCase()] || "outline";
  };

  if (isLoading) {
    return (
      <div className="border rounded-md h-[240px] p-2">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-2 gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="border rounded-md h-[240px] flex items-center justify-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="border rounded-md h-[240px] p-1">
      <div className="space-y-1">
        {users.map((user) => {
          const isSelected = selectedUserId === String(user.id);
          
          return (
            <div
              key={user.id}
              className={`flex items-center p-2 rounded-md cursor-pointer ${
                isSelected ? 'bg-primary/10' : 'hover:bg-muted'
              } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
              onClick={() => !disabled && onSelectUser(user)}
            >
              <Avatar 
                src={user.avatar} 
                name={user.name} 
                size="sm" 
                className="mr-3"
              />
              <div className="flex-grow">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              {user.role && (
                <Badge variant={getBadgeVariant(user.role)} className="text-[10px] font-normal mr-2">
                  {user.role}
                </Badge>
              )}
              {isSelected && (
                <Check size={16} className="text-primary" />
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default UserSearchResults;
