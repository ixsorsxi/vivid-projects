
import React from 'react';
import { SystemUser } from '@/components/projects/team/types';
import { Loader2 } from 'lucide-react';
import SystemUserItem from './SystemUserItem';

interface SystemUsersListProps {
  users: SystemUser[];
  isLoading: boolean;
  searchQuery: string;
  selectedUsers: number[];
  handleUserSelection: (userId: number) => void;
}

const SystemUsersList: React.FC<SystemUsersListProps> = ({
  users,
  isLoading,
  searchQuery,
  selectedUsers,
  handleUserSelection
}) => {
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) || 
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          {searchQuery ? 'No users found matching your search' : 'No system users available'}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
      {filteredUsers.map(user => (
        <SystemUserItem 
          key={user.id}
          user={user}
          isSelected={selectedUsers.includes(Number(user.id))}
          onSelect={() => handleUserSelection(Number(user.id))}
        />
      ))}
    </div>
  );
};

export default SystemUsersList;
