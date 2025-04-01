
import { useState, useCallback } from 'react';
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
      
      // First get all profiles regardless of the current user
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
      
      console.log('Fetched profiles data:', profilesData);
      
      // Fetch all custom roles to map IDs to names
      const { data: rolesData, error: rolesError } = await supabase
        .from('custom_roles')
        .select('id, name');
        
      if (rolesError) {
        console.error('Error fetching custom roles:', rolesError);
      }
      
      // Create a map of role IDs to role names
      const roleMap = (rolesData || []).reduce((map: Record<string, string>, role) => {
        map[role.id] = role.name;
        return map;
      }, {});
      
      // Get auth users for last login data
      // Define a proper type for auth users to fix the "never" type error
      type AuthUser = {
        id: string;
        last_sign_in_at?: string | null;
      };
      
      const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError);
      }
      
      // Create a map of user IDs to last sign in time
      const lastSignInMap: Record<string, string> = {};
      
      // Safely access and use the auth users data with proper type checking
      if (authUsersData && 'users' in authUsersData && Array.isArray(authUsersData.users)) {
        (authUsersData.users as AuthUser[]).forEach(user => {
          if (user && user.id) {
            lastSignInMap[user.id] = user.last_sign_in_at || '';
          }
        });
      }
      
      const formattedUsers: UserData[] = profilesData.map(user => ({
        id: user.id,
        name: user.full_name || user.username || 'Unnamed User',
        email: user.username || '',
        role: user.role || 'user',
        status: 'active', // We don't have a status field yet, defaulting to active
        lastLogin: lastSignInMap[user.id] 
          ? new Date(lastSignInMap[user.id]).toISOString().split('T')[0] 
          : user.created_at 
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
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers
  };
};
