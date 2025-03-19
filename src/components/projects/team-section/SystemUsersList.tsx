
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { SystemUser } from '@/components/projects/team/types';
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
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search users..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {isLoading ? (
        <div className="p-4 text-center">Loading users...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <SystemUserItem
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.includes(user.id)}
                  onSelectionChange={() => handleUserSelection(user.id)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No users match your search
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemUsersList;
