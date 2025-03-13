
import { useState } from 'react';

export const useDialogs = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    searchDialogOpen,
    setSearchDialogOpen,
    userSearchQuery,
    setUserSearchQuery
  };
};
