
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';
import { useAuth } from '@/context/auth';

export const useTeamData = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Log initial team data to help debug
    console.log('[TEAM-DATA] useTeamData initialTeam:', initialTeam);
    
    if (!initialTeam || initialTeam.length === 0) {
      // If no initial team is provided, try to fetch from the server
      if (projectId) {
        refreshTeamMembers();
        return;
      }
    }
    
    const validTeam = (initialTeam || []).map(member => ({
      id: member.id || String(Date.now()),
      name: member.name || 'Team Member', // Use name field primarily
      role: member.role || 'Member',
      user_id: member.user_id
    }));
    
    console.log('[TEAM-DATA] Processed team members:', validTeam);
    setTeamMembers(validTeam);
  }, [initialTeam, projectId]);

  const refreshTeamMembers = async () => {
    if (!projectId) return;
    
    setIsRefreshing(true);
    try {
      console.log('[TEAM-DATA] Refreshing team members for project:', projectId);

      // First try using the API function which has multiple fallback strategies
      try {
        const members = await fetchProjectTeamMembers(projectId);
        
        if (members && members.length > 0) {
          console.log('[TEAM-DATA] Successfully fetched team members via API:', members);
          setTeamMembers(members);
          setIsRefreshing(false);
          return;
        }
      } catch (apiError) {
        console.error('[TEAM-DATA] Error fetching via API:', apiError);
      }

      // Direct query to project_members
      try {
        console.log("[TEAM-DATA] Trying direct query to project_members");
        const { data, error } = await supabase
          .from('project_members')
          .select('id, user_id, name, role')
          .eq('project_id', projectId);
        
        if (!error && data && data.length > 0) {
          console.log('[TEAM-DATA] Retrieved team data from direct query:', data);
          setTeamMembers(data.map(member => ({
            id: member.id,
            name: member.name || 'Team Member',
            role: member.role || 'Member',
            user_id: member.user_id
          })));
          
          setIsRefreshing(false);
          return;
        }
      } catch (queryErr) {
        console.warn('[TEAM-DATA] Error in direct query approach:', queryErr);
      }

      // Try RPC function as fallback
      try {
        console.log("[TEAM-DATA] Trying RPC function");
        const { data: projectData, error: rpcError } = await supabase
          .rpc('get_project_by_id', { p_project_id: projectId });
        
        if (!rpcError && projectData) {
          const project = Array.isArray(projectData) ? projectData[0] : projectData;
          
          if (project && project.team && Array.isArray(project.team)) {
            console.log('[TEAM-DATA] Retrieved team data from RPC:', project.team);
            setTeamMembers(project.team.map((member: any) => ({
              id: member.id || String(Date.now()),
              name: member.name || 'Team Member',
              role: member.role || 'Member',
              user_id: member.user_id
            })));
            
            setIsRefreshing(false);
            return;
          }
        }
      } catch (rpcErr) {
        console.warn('[TEAM-DATA] Error in RPC approach:', rpcErr);
      }

      // If all methods failed, show an error
      console.warn('[TEAM-DATA] Could not retrieve team members through any method');
      setTeamMembers([]);
      setIsRefreshing(false);
    } catch (err) {
      console.error('[TEAM-DATA] Error in refreshTeamMembers:', err);
      setTeamMembers([]);
      setIsRefreshing(false);
    }
  };

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
