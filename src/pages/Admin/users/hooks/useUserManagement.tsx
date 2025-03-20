
import { useUserFetch } from './useUserFetch';
import { useUserMutations } from './useUserMutations';
import { UserData } from './useUserTypes';

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

  const addNewUser = async () => {
    // After successful creation, we'll refetch the users to get the updated list
    await fetchUsers();
  };

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
