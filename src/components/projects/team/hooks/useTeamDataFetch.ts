
import { useState, useCallback, useEffect } from 'react';
import { TeamMember } from '../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';

/**
 * Hook for fetching team members data
 */
export const useTeamDataFetch = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch team members from the API
  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) {
      console.warn('No project ID provided for fetching team members');
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      console.log('Fetching team members for project:', projectId);
      const members = await fetchProjectTeamMembers(projectId);
      
      if (Array.isArray(members)) {
        console.log('Fetched team members:', members);
        setTeamMembers(members);
      } else {
        console.error('Invalid response from fetchProjectTeamMembers:', members);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  // Initial fetch of team members
  useEffect(() => {
    if (projectId) {
      refreshTeamMembers();
    }
  }, [projectId, refreshTeamMembers]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
