
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar.custom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SystemUser } from '../types';
import { cn } from '@/lib/utils';
import { debugLog } from '@/utils/debugLogger';

interface UserSelectorProps {
  users: SystemUser[];
  selectedUser: SystemUser | null;
  onSelectUser: (user: SystemUser | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUser,
  onSelectUser,
  isLoading = false,
  disabled = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<SystemUser[]>(users);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => {
      return (
        user.name.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
    });

    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  // Handler for selecting a user
  const handleUserClick = (user: SystemUser) => {
    if (disabled) return;
    
    // If user is already selected, deselect them
    if (selectedUser?.id === user.id) {
      onSelectUser(null);
    } else {
      // Log the user selection with exact ID type
      debugLog('UserSelector', 'User selected:', user.id, `(${typeof user.id})`, user.name);
      onSelectUser(user);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          disabled={disabled || isLoading}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading users...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching "{searchQuery}"
        </div>
      ) : (
        <ScrollArea className="h-[230px] border rounded-md">
          <div className="p-1">
            {filteredUsers.map((user) => (
              <button
                key={typeof user.id === 'string' ? user.id : String(user.id)}
                type="button"
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left",
                  selectedUser?.id === user.id ? "bg-accent/70 ring-1 ring-ring" : "",
                  disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                )}
                onClick={() => handleUserClick(user)}
                disabled={disabled}
              >
                <div className="relative">
                  <Avatar 
                    name={user.name} 
                    src={user.avatar} 
                    size="sm" 
                  />
                  {selectedUser?.id === user.id && (
                    <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
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
      )}
    </div>
  );
};

export default UserSelector;
