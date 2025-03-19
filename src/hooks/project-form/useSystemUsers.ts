
import { useState, useEffect } from 'react';
import { SystemUser } from '@/components/projects/team/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export const useSystemUsers = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real users from Supabase profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, role')
          .order('full_name');
        
        if (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to load team members', { 
            description: 'Could not fetch users from the database.' 
          });
          // Fall back to mock data if there's an error
          setUsers(getMockUsers());
          return;
        }
        
        // Map Supabase data to the SystemUser type
        const mappedUsers: SystemUser[] = (data || []).map(user => ({
          id: parseInt(user.id.slice(0, 8), 16) || Math.floor(Math.random() * 10000), // Generate numeric ID from UUID
          name: user.full_name || user.username || 'Unknown User',
          email: user.username || `user-${user.id.slice(0, 8)}@example.com`,
          role: user.role || 'User',
          avatar: user.avatar_url || '/placeholder.svg'
        }));
        
        if (mappedUsers.length === 0) {
          console.log('No users found, using mock data');
          setUsers(getMockUsers());
        } else {
          console.log('Fetched users:', mappedUsers);
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        // Fall back to mock data on error
        setUsers(getMockUsers());
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Provide mock data as fallback
  const getMockUsers = (): SystemUser[] => {
    return [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Designer', avatar: '/placeholder.svg' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Developer', avatar: '/placeholder.svg' },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Product Manager', avatar: '/placeholder.svg' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Marketing', avatar: '/placeholder.svg' },
      { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'CEO', avatar: '/placeholder.svg' },
    ];
  };

  return { users, isLoading };
};
