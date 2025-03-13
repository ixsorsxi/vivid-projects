
import { SystemUser } from '../types';
import { systemUsers } from '../data';

export const filterUsers = (searchQuery: string): SystemUser[] => {
  return systemUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
