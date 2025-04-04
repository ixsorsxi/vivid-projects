
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { 
  fetchUserProjectPermissions, 
  checkUserProjectPermission 
} from '@/api/projects/modules/team/rolePermissions';
import type { ProjectPermissionName } from '@/api/projects/modules/team/types';

export interface UseProjectPermissionsProps {
  projectId: string;
}

export const useProjectPermissions = ({ projectId }: UseProjectPermissionsProps) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user permissions when component mounts
  useEffect(() => {
    const loadPermissions = async () => {
      if (!projectId || !user?.id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const userPermissions = await fetchUserProjectPermissions(projectId, user.id);
        setPermissions(userPermissions);
      } catch (err) {
        console.error('Error loading user permissions:', err);
        setError('Failed to load permissions');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, [projectId, user?.id]);
  
  // Check if user has a specific permission
  const hasPermission = (permissionName: ProjectPermissionName): boolean => {
    return permissions.includes(permissionName);
  };
  
  // Check multiple permissions (returns true if user has ANY of the permissions)
  const hasAnyPermission = (permissionNames: ProjectPermissionName[]): boolean => {
    return permissionNames.some(permission => permissions.includes(permission));
  };
  
  // Check multiple permissions (returns true if user has ALL of the permissions)
  const hasAllPermissions = (permissionNames: ProjectPermissionName[]): boolean => {
    return permissionNames.every(permission => permissions.includes(permission));
  };
  
  // Refresh permissions
  const refreshPermissions = async () => {
    if (!projectId || !user?.id) return;
    
    setIsLoading(true);
    
    try {
      const userPermissions = await fetchUserProjectPermissions(projectId, user.id);
      setPermissions(userPermissions);
    } catch (err) {
      console.error('Error refreshing user permissions:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
    error,
    refreshPermissions
  };
};
