
import React from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { SystemUser } from './types';

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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No users found</p>
        <p className="text-sm">Try a different search or invite by email</p>
      </div>
    );
  }
  
  return (
    <div className="max-h-60 overflow-y-auto space-y-1">
      {users.map((user) => (
        <Card 
          key={user.id}
          onClick={() => !disabled && onSelectUser(user)}
          className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
            String(user.id) === selectedUserId ? 
            'bg-primary/10 border-primary' : 
            'hover:bg-muted/50'
          } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-8 w-8 rounded-full object-cover" 
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{user.name}</p>
            {user.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
          {user.role && (
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {user.role}
            </span>
          )}
        </Card>
      ))}
    </div>
  );
};

export default UserSearchResults;
