
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { 
  hasProjectPermission,
  getUserProjectPermissions 
} from '@/api/projects/modules/team/permissions';  // Updated import path

export const useProjectPermissions = (projectId?: string) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadPermissions = async () => {
      if (!projectId || !user) return;
      
      setIsLoading(true);
      try {
        const userPermissions = await getUserProjectPermissions(user.id, projectId);
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Error loading user permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [projectId, user]);

  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!projectId || !user) return false;
    
    try {
      return await hasProjectPermission(user.id, projectId, permission as any);
    } catch (error) {
      console.error(`Error checking permission ${permission}:`, error);
      return false;
    }
  };

  return {
    permissions,
    hasPermission: checkPermission,
    isLoading
  };
};
