
import React from 'react';
import SearchUserDialog from './SearchUserDialog';
import DeleteConversationDialog from './DeleteConversationDialog';
import { SystemUser } from '../types';

interface DialogContainerProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  searchDialogOpen: boolean;
  setSearchDialogOpen: (open: boolean) => void;
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  filteredUsers: SystemUser[];
  selectedConversationName: string;
  onAddUser: (user: SystemUser) => void;
  onDeleteConversation: () => void;
}

const DialogContainer = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  searchDialogOpen,
  setSearchDialogOpen,
  userSearchQuery,
  setUserSearchQuery,
  filteredUsers,
  selectedConversationName,
  onAddUser,
  onDeleteConversation
}: DialogContainerProps) => {
  return (
    <>
      <SearchUserDialog 
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        filteredUsers={filteredUsers}
        searchQuery={userSearchQuery}
        onSearchQueryChange={setUserSearchQuery}
        onAddUser={onAddUser}
      />

      <DeleteConversationDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        conversationName={selectedConversationName}
        onConfirmDelete={onDeleteConversation}
      />
    </>
  );
};

export default DialogContainer;
