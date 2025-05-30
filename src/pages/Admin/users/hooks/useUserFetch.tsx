
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { UserData } from './useUserTypes';

export const useUserFetch = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching all users from profiles table');
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, role, avatar_url, created_at, custom_role_id, updated_at');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load users');
        setUsers([]);
        setIsLoading(false);
        return;
      }
      
      if (!profilesData || profilesData.length === 0) {
        console.log('No user profiles found in the database');
        setUsers([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`Successfully fetched ${profilesData.length} user profiles`);
      
      // Fetch all system roles to map IDs to names
      const { data: rolesData, error: rolesError } = await supabase
        .from('system_roles')
        .select('id, name');
        
      if (rolesError) {
        console.error('Error fetching system roles:', rolesError);
      }
      
      // Create a map of role IDs to role names
      const roleMap: Record<string, string> = {};
      if (rolesData) {
        rolesData.forEach(role => {
          roleMap[role.id] = role.name;
        });
      }
      
      // Format user data for display - don't replace the entire users array
      const formattedUsers: UserData[] = profilesData.map(user => ({
        id: user.id,
        name: user.full_name || user.username || 'Unnamed User',
        email: user.username || '',
        role: user.role || 'user',
        status: 'active', // Default to active since we can't access the auth data
        lastLogin: user.created_at 
          ? new Date(user.created_at).toISOString().split('T')[0] 
          : 'Never',
        customRoleId: user.custom_role_id || undefined,
        customRoleName: user.custom_role_id ? roleMap[user.custom_role_id] : undefined
      }));
      
      console.log('Formatted users for display:', formattedUsers);
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      toast.error('An error occurred while fetching users');
      // Don't reset users array on error to preserve existing data
      // setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatically fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers
  };
};
