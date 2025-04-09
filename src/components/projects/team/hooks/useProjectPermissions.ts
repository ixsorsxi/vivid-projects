
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { 
  checkUserProjectPermission,
  fetchUserProjectPermissions 
} from '@/api/projects/modules/team/rolePermissions';

export const useProjectPermissions = (projectId?: string) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadPermissions = async () => {
      if (!projectId || !user) return;
      
      setIsLoading(true);
      try {
        const userPermissions = await fetchUserProjectPermissions(projectId, user.id);
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Error loading user permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, [projectId, user]);

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!projectId || !user) return false;
    
    try {
      return await checkUserProjectPermission(projectId, user.id, permission as any);
    } catch (error) {
      console.error(`Error checking permission ${permission}:`, error);
      return false;
    }
  };

  return {
    permissions,
    hasPermission,
    isLoading
  };
};
