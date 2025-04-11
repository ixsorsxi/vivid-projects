
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProjectTeamSecurely, checkSecureProjectAccess } from '@/api/projects/modules/team/rls-bypass';
import { TeamMember } from '@/api/projects/modules/team/types';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Custom hook for securely accessing project team data
 * Handles RLS bypass and proper error handling
 */
export const useProjectTeamAccess = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if user has access to this project
  const checkAccess = useCallback(async () => {
    if (!projectId) return false;
    
    try {
      const canAccess = await checkSecureProjectAccess(projectId);
      setHasAccess(canAccess);
      return canAccess;
    } catch (err) {
      console.error('Error checking project access:', err);
      setHasAccess(false);
      return false;
    }
  }, [projectId]);

  // Fetch team members securely
  const fetchTeamMembers = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if user has access
      const hasProjectAccess = await checkAccess();
      
      if (!hasProjectAccess) {
        console.log('User does not have access to this project');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch team members using secure method
      const members = await getProjectTeamSecurely(projectId);
      setTeamMembers(members);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching team members');
      console.error('Error fetching team members:', error);
      setError(error);
      
      toast.error('Error loading team', {
        description: 'Failed to load team members. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, checkAccess]);

  // Initial fetch
  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    }
  }, [projectId, fetchTeamMembers]);

  return {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    refreshTeamMembers: fetchTeamMembers
  };
};
