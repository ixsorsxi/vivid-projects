
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';
import { supabase } from '@/integrations/supabase/client';

export const useTeamData = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      
      // Try direct query using the new RLS policies
      console.log('[TEAM-DATA] Attempting direct query with new RLS policies');
      const { data: directData, error: directError } = await supabase
        .from('project_members')
        .select('id, user_id, name, role')
        .eq('project_id', projectId);
        
      if (directError) {
        console.error('[TEAM-DATA] Error with direct query:', directError);
      } else if (directData && directData.length > 0) {
        console.log('[TEAM-DATA] Fetched team members directly:', directData);
        
        const formattedMembers = directData.map(member => ({
          id: member.id,
          // Use name if available, or format role for display
          name: member.name || (member.role ? member.role.replace(/-/g, ' ') : 'Team Member'),
          role: member.role || 'Member',
          user_id: member.user_id
        }));
        
        setTeamMembers(formattedMembers);
        setIsRefreshing(false);
        return;
      } else {
        console.log('[TEAM-DATA] No team members found in direct query');
      }
      
      // Fallback to the API function
      console.log('[TEAM-DATA] Falling back to fetchProjectTeamMembers API');
      const members = await fetchProjectTeamMembers(projectId);
      console.log('[TEAM-DATA] Fetched team members via API:', members);
      
      if (Array.isArray(members)) {
        // Ensure proper formatting of members
        const formattedMembers = members.map(member => ({
          ...member,
          name: member.name !== member.role ? member.name : 'Team Member'
        }));
        setTeamMembers(formattedMembers);
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

  // Fetch team members on initial load and when projectId changes
  useEffect(() => {
    if (projectId) {
      refreshTeamMembers();
    } else {
      // If no projectId, use the initial team data
      setTeamMembers(initialTeam || []);
    }
  }, [projectId, initialTeam, refreshTeamMembers]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
