
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../../types';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';

export const useTeamData = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log("Initial team data:", initialTeam, "Project ID:", projectId);
  
  // Function to refresh team members
  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) {
      console.warn('Cannot fetch team members: No project ID provided');
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      console.log('Refreshing team members for project:', projectId);
      
      const members = await fetchProjectTeamMembers(projectId);
      console.log('Fetched team members:', members);
      
      if (Array.isArray(members)) {
        setTeamMembers(members);
      } else {
        console.error('Invalid team members data received:', members);
      }
    } catch (error) {
      console.error('Error refreshing team members:', error);
      toast.error('Error loading team members', {
        description: 'Failed to load team members. Please try again.'
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);
  
  // Fetch team members on mount and whenever projectId changes
  useEffect(() => {
    if (projectId) {
      console.log('Fetching initial team members for project:', projectId);
      refreshTeamMembers();
    } else if (initialTeam && initialTeam.length > 0) {
      // If no projectId but initialTeam is provided, use that
      console.log('Using initial team data:', initialTeam);
      setTeamMembers(initialTeam);
    }
  }, [projectId, refreshTeamMembers]);
  
  // Also update local state if initialTeam changes
  useEffect(() => {
    if (initialTeam && initialTeam.length > 0 && !isRefreshing) {
      console.log('Updating team members from new initialTeam:', initialTeam);
      setTeamMembers(initialTeam);
    }
  }, [initialTeam, isRefreshing]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};

export default useTeamData;
