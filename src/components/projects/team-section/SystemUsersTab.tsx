
import React from 'react';
import { Button } from "@/components/ui/button";
import { SystemUser } from '@/components/projects/team/types';
import { UserPlus, Loader2 } from 'lucide-react';
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
      <SystemUsersList 
        users={users}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
