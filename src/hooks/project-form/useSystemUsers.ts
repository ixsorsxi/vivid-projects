
import { useState, useEffect } from 'react';
import { SystemUser } from '@/components/projects/team/types';

// This is a sample implementation, replace with actual API call when ready
export const useSystemUsers = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Mock data for demo purposes - replace with actual API call
        const mockUsers: SystemUser[] = [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Designer', avatar: '/placeholder.svg' },
          { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Developer', avatar: '/placeholder.svg' },
          { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Product Manager', avatar: '/placeholder.svg' },
          { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Marketing', avatar: '/placeholder.svg' },
          { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'CEO', avatar: '/placeholder.svg' },
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setUsers(mockUsers);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading };
};
