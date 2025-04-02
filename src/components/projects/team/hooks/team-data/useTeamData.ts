
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';

export const useTeamData = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const validTeam = (initialTeam || []).map(member => ({
      id: member.id || String(Date.now()),
      name: member.name || 'Team Member',
      role: member.role || 'Member',
      user_id: member.user_id
    }));
    
    setTeamMembers(validTeam);
  }, [initialTeam]);

  const refreshTeamMembers = async () => {
    if (!projectId) return;
    
    setIsRefreshing(true);
    try {
      console.log('Refreshing team members for project:', projectId);
      
      // Try fetching from RPC function first as it might bypass RLS issues
      const { data: projectData, error: rpcError } = await supabase
        .rpc('get_project_by_id', { p_project_id: projectId });
      
      if (!rpcError && projectData) {
        const project = Array.isArray(projectData) ? projectData[0] : projectData;
        
        if (project && project.team && Array.isArray(project.team)) {
          console.log('Team data from RPC:', project.team);
          const teamFromRPC = project.team.map((member: any) => ({
            id: member.id,
            name: member.name || 'Team Member',
            role: member.role || 'Member',
            user_id: member.user_id
          }));
          
          setTeamMembers(teamFromRPC);
          setIsRefreshing(false);
          return;
        }
      }
      
      // Fetch team members using the dedicated function
      const members = await fetchProjectTeamMembers(projectId);
      if (members && members.length > 0) {
        console.log('Team members from dedicated function:', members);
        setTeamMembers(members);
        setIsRefreshing(false);
        return;
      }
      
      // Fall back to direct query if other methods fail
      const { data, error } = await supabase
        .from('project_members')
        .select('id, user_id, name, role')
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Error refreshing team members:', error);
        toast.error("Couldn't refresh team members", {
          description: "Please try again or reload the page"
        });
        setIsRefreshing(false);
        return;
      }
      
      if (data) {
        console.log('Team members from direct query:', data);
        const freshTeamMembers = data.map(member => ({
          id: member.id,
          name: member.name || 'Team Member',
          role: member.role || 'Member',
          user_id: member.user_id
        }));
        
        setTeamMembers(freshTeamMembers);
      }
    } catch (err) {
      console.error('Error in refreshTeamMembers:', err);
      toast.error("Error refreshing team", {
        description: "An unexpected error occurred"
      });
    } finally {
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
