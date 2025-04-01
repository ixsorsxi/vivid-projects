
import { useUserFetch } from './useUserFetch';
import { useUserMutations } from './useUserMutations';
import { UserData } from './useUserTypes';
import { useCallback, useEffect } from 'react';

export type { UserData };

export const useUserManagement = () => {
  const {
    users,
    setUsers,
    isLoading,
    fetchUsers
  } = useUserFetch();

  const {
    deleteUser,
    toggleUserStatus,
    updateUser,
    isAdmin
  } = useUserMutations(users, setUsers, fetchUsers);

  const addNewUser = useCallback(async () => {
    // After successful creation, we'll refetch the users to get the updated list
    await fetchUsers();
  }, [fetchUsers]);

  // Log user count on mount and on users change for debugging
  useEffect(() => {
    console.log(`useUserManagement: ${users.length} users loaded, isLoading: ${isLoading}`);
  }, [users, isLoading]);

  return {
    users,
    isLoading,
    deleteUser,
    toggleUserStatus,
    updateUser,
    addNewUser,
    fetchUsers,
    isAdmin
  };
};
