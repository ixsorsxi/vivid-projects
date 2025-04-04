import { useState, useCallback, useEffect } from 'react';
import { TeamMember } from '../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';

export const useTeamDataFetch = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) {
      console.log('No project ID provided, cannot fetch team members');
      setTeamMembers([]);
      setIsRefreshing(false);
      return;
    }
    
    try {
      console.log('Refreshing team members for project:', projectId);
      setIsRefreshing(true);
      
      const members = await fetchProjectTeamMembers(projectId);
      console.log('Fetched team members:', members);
      
      // Update state with fetched members
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      // Keep current members on error
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);
  
  // Load team members on component mount and when projectId changes
  useEffect(() => {
    refreshTeamMembers();
  }, [projectId, refreshTeamMembers]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
