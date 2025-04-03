
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';
import { supabase } from '@/integrations/supabase/client';

export const useTeamData = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch team members on initial load and when projectId changes
  useEffect(() => {
    if (projectId) {
      refreshTeamMembers();
    } else {
      // If no projectId, use the initial team data
      setTeamMembers(initialTeam || []);
    }
  }, [projectId]);

  // Helper for debugging team members state
  useEffect(() => {
    console.log('[TEAM-DATA] Current team members:', teamMembers);
  }, [teamMembers]);

  // Function to refresh team members data
  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) {
      console.warn('[TEAM-DATA] Cannot refresh team members: No project ID provided');
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      console.log('[TEAM-DATA] Refreshing team members for project:', projectId);
      
      // First, check if the project exists
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', projectId)
        .single();
        
      if (projectError) {
        console.error('[TEAM-DATA] Error fetching project:', projectError);
        if (projectError.code === 'PGRST116') {
          toast.error('Project not found', { 
            description: 'The project could not be found or you don\'t have access to it.'
          });
        }
        setIsRefreshing(false);
        return;
      }
      
      // Then, fetch the team members
      const members = await fetchProjectTeamMembers(projectId);
      console.log('[TEAM-DATA] Fetched team members:', members);
      
      if (Array.isArray(members)) {
        setTeamMembers(members);
      } else {
        console.error('[TEAM-DATA] Invalid team members data returned:', members);
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('[TEAM-DATA] Error refreshing team members:', error);
      toast.error('Error loading team', {
        description: 'Failed to load team members. Please try again.'
      });
      setTeamMembers([]);
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
