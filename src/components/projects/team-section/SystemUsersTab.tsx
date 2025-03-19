
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
}

const SystemUsersTab: React.FC<SystemUsersTabProps> = ({
  users,
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedUsers,
  handleUserSelection,
  handleAddSelectedUsers
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
          type="button" 
          onClick={handleAddSelectedUsers}
          disabled={selectedUsers.length === 0}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Selected Users
        </Button>
      </div>
    </div>
  );
};

export default SystemUsersTab;
