import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { 
  fetchUserProjectPermissions, 
  checkUserProjectPermission 
} from '@/api/projects/modules/team/rolePermissions';
import type { ProjectPermissionName } from '@/api/projects/modules/team/types';

export const useProjectPermissions = (projectId?: string) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!projectId || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userPermissions = await fetchUserProjectPermissions(projectId, user.id);
        console.log('User permissions:', userPermissions);
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [projectId, user?.id]);

  const checkPermission = async (permission: ProjectPermissionName): Promise<boolean> => {
    if (!projectId || !user?.id) return false;
    
    // Check local permissions first if we've already fetched them
    if (permissions.length > 0) {
      return permissions.includes(permission);
    }
    
    // Otherwise check directly against the API
    try {
      return await checkUserProjectPermission(projectId, user.id, permission);
    } catch (error) {
      console.error(`Error checking permission ${permission}:`, error);
      return false;
    }
  };

  return {
    permissions,
    isLoading,
    checkPermission,
    hasPermission: (permission: ProjectPermissionName) => permissions.includes(permission)
  };
};
