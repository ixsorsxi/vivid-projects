import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';
import { useAuth } from '@/context/auth';

export const useTeamData = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  // Create a memoized refresh function to avoid recreation on every render
  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) return;
    
    setIsRefreshing(true);
    try {
      console.log('[TEAM-DATA] Refreshing team members for project:', projectId);
      
      // Use the fetchProjectTeamMembers function which has been improved
      const members = await fetchProjectTeamMembers(projectId);
      
      if (members && members.length > 0) {
        console.log('[TEAM-DATA] Successfully fetched team members:', members);
        setTeamMembers(members);
      } else {
        console.log('[TEAM-DATA] No team members found or error fetching members');
        // Keep existing team members if fetch returns empty (could be temporary issue)
      }
    } catch (err) {
      console.error('[TEAM-DATA] Error in refreshTeamMembers:', err);
      toast.error("Error refreshing team members", {
        description: "Could not load the latest team data. Please try again."
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  // Effect to initialize team members
  useEffect(() => {
    // Log initial team data to help debug
    console.log('[TEAM-DATA] useTeamData initialTeam:', initialTeam);
    
    if (initialTeam && initialTeam.length > 0) {
      // If initial team is provided, use it
      const validTeam = initialTeam.map(member => ({
        id: member.id || String(Date.now()),
        name: member.name || 'Team Member',
        role: member.role || 'Member',
        user_id: member.user_id
      }));
      
      console.log('[TEAM-DATA] Processed initial team members:', validTeam);
      setTeamMembers(validTeam);
    } else if (projectId) {
      // If no initial team but projectId exists, fetch from server
      refreshTeamMembers();
    }
  }, [initialTeam, projectId, refreshTeamMembers]);

  // Effect to refresh team members when user changes
  useEffect(() => {
    if (user && projectId) {
      console.log('[TEAM-DATA] User or projectId changed, refreshing team members');
      refreshTeamMembers();
    }
  }, [user, projectId, refreshTeamMembers]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
