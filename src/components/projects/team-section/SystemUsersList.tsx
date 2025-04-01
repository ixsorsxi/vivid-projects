
import React, { useState } from 'react';
import { SystemUser } from '@/components/projects/team/types';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import SystemUserItem from './SystemUserItem';

interface SystemUsersListProps {
  users: SystemUser[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedUsers: number[];
  handleUserSelection: (userId: number) => void;
}

const SystemUsersList: React.FC<SystemUsersListProps> = ({
  users,
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedUsers,
  handleUserSelection
}) => {
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            disabled
          />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No users match your search criteria</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            // Convert user.id to number to ensure proper handling
            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
            return (
              <SystemUserItem 
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(userId)}
                onSelect={() => handleUserSelection(userId)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SystemUsersList;
