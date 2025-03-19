
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SystemUser } from '@/components/projects/team/types';
import Avatar from "@/components/ui/avatar";

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
                <div 
                  key={user.id}
                  className="flex items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/50"
                >
                  <Checkbox 
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserSelection(user.id)}
                    className="mr-3"
                  />
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
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
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
