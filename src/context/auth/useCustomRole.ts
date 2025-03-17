
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustomRole } from './types';

export const useCustomRole = () => {
  const [customRole, setCustomRole] = useState<CustomRole | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  const fetchUserCustomRole = async (profileData: any): Promise<CustomRole | null> => {
    if (!profileData?.custom_role_id) return null;
    
    try {
      // Fetch the custom role
      const { data: roleData, error: roleError } = await supabase
        .from('custom_roles')
        .select('*')
        .eq('id', profileData.custom_role_id)
        .single();
      
      if (roleError || !roleData) {
        console.error("Error fetching custom role:", roleError);
        return null;
      }
      
      // Fetch the role permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('role_id', roleData.id)
        .eq('enabled', true);
      
      if (permissionsError) {
        console.error("Error fetching role permissions:", permissionsError);
      }
      
      const roleWithPermissions: CustomRole = {
        id: roleData.id,
        name: roleData.name,
        base_type: roleData.base_type,
        permissions: permissionsData?.map(p => p.permission) || []
      };
      
      setCustomRole(roleWithPermissions);
      setRolePermissions(roleWithPermissions.permissions || []);
      
      return roleWithPermissions;
    } catch (error) {
      console.error("Error in fetchUserCustomRole:", error);
      return null;
    }
  };

  return {
    customRole,
    rolePermissions,
    fetchUserCustomRole
  };
};
