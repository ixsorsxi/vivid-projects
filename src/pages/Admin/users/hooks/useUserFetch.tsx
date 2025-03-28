
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { UserData } from './useUserTypes';

export const useUserFetch = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // First get the profiles with their custom role IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, role, avatar_url, created_at, custom_role_id');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load users');
        return;
      }
      
      if (!profilesData) {
        setUsers([]);
        return;
      }
      
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
      
      const formattedUsers: UserData[] = profilesData.map(user => ({
        id: user.id,
        name: user.full_name || 'Unnamed User',
        email: user.username || '',
        role: user.role || 'user',
        status: 'active', // We don't have a status field yet, defaulting to active
        lastLogin: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Never',
        customRoleId: user.custom_role_id || undefined,
        customRoleName: user.custom_role_id ? roleMap[user.custom_role_id] : undefined
      }));
      
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers
  };
};
