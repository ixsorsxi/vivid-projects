
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Search } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { SystemUser } from '@/components/projects/team/types';
import SystemUsersList from './SystemUsersList';

interface SystemUsersTabProps {
  users: SystemUser[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedUsers: number[];
  handleUserSelection: (userId: number) => void;
  handleAddSelectedUsers: () => void;
  isSubmitting?: boolean;
}

const SystemUsersTab: React.FC<SystemUsersTabProps> = ({
  users,
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedUsers,
  handleUserSelection,
  handleAddSelectedUsers,
  isSubmitting = false
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <SystemUsersList 
        users={users}
        isLoading={isLoading}
        searchQuery={searchQuery}
        selectedUsers={selectedUsers}
        handleUserSelection={handleUserSelection}
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleAddSelectedUsers}
          disabled={selectedUsers.length === 0 || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Add Selected ({selectedUsers.length})</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SystemUsersTab;
