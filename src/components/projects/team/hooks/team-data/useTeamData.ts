
import { useState, useCallback, useEffect } from 'react';
import { TeamMember } from '../../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTeamData = (
  initialTeam: TeamMember[] = [],
  projectId?: string
) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  // Console log when team members change
  useEffect(() => {
    console.log('[useTeamData] Team members state updated:', teamMembers);
  }, [teamMembers]);

  // Update when initialTeam changes
  useEffect(() => {
    if (initialTeam && initialTeam.length > 0) {
      console.log('[useTeamData] Initial team data received:', initialTeam);
      setTeamMembers(initialTeam);
    }
  }, [initialTeam]);

  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) {
      console.log('[useTeamData] No project ID provided for refreshing team members');
      return;
    }

    if (!user) {
      console.log('[useTeamData] No authenticated user for refreshing team members');
      return;
    }

    setIsRefreshing(true);

    try {
      console.log('[useTeamData] Refreshing team members for project:', projectId);
      const members = await fetchProjectTeamMembers(projectId);
      
      console.log('[useTeamData] Fetched team members:', members);
      
      if (members && Array.isArray(members)) {
        setTeamMembers(members);
      } else {
        console.warn('[useTeamData] Received non-array data for team members');
      }
    } catch (error) {
      console.error('[useTeamData] Error refreshing team members:', error);
      toast.error('Error loading team members', {
        description: 'Failed to load team members. Please try again.'
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId, user]);

  // Initial fetch when component mounts or projectId changes
  useEffect(() => {
    if (projectId && user) {
      console.log('[useTeamData] Initial team members fetch for project:', projectId);
      refreshTeamMembers();
    }
  }, [projectId, user, refreshTeamMembers]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
