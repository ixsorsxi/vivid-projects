
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';
import { useAuth } from '@/context/auth';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team';
import { addProjectTeamMember, removeProjectTeamMember } from '@/api/projects/modules/team';

export const useTeamMembers = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const { user } = useAuth();

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

  const handleAddMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    if (projectId) {
      // If we have a logged-in user, pass their ID for the operation to work with RLS
      const enhancedMember = {
        ...member,
        user_id: member.user_id || (user ? user.id : undefined)
      };
      
      const success = await addProjectTeamMember(projectId, enhancedMember);
      
      if (success) {
        // After successful API call, immediately update the UI first
        const newMember: TeamMember = {
          id: member.id || String(Date.now()),
          name: member.name,
          role: member.role,
          user_id: member.user_id
        };
        
        setTeamMembers(prev => [...prev, newMember]);
        
        toast.success("Team member added", {
          description: `${member.name} has been added to the project team`,
        });
        
        // Then refresh to ensure we have the latest data
        await refreshTeamMembers();
      } else {
        toast.error("Failed to add team member", {
          description: "There was an error adding the team member to the project",
        });
      }
    } else {
      const newMember: TeamMember = {
        id: member.id || String(Date.now()),
        name: member.name,
        role: member.role,
        user_id: member.user_id
      };
      
      setTeamMembers([...teamMembers, newMember]);
      toast("Team member added", {
        description: `${member.name} has been added to the project team`,
      });
    }
  };

  const handleRemoveMember = async (id: string | number) => {
    const stringId = id.toString();
    setIsRemoving(stringId);
    
    try {
      if (projectId) {
        console.log(`Attempting to remove team member with ID: ${stringId} from project: ${projectId}`);
        
        // Immediately update the UI by filtering out the removed member
        setTeamMembers(current => current.filter(member => member.id.toString() !== stringId));
        
        // Then attempt the server operation
        const success = await removeProjectTeamMember(projectId, stringId);
        
        if (success) {
          toast.success("Team member removed", {
            description: "The team member has been removed from the project",
          });
          
          // We've already updated the UI, so no need to update again
          // Just refresh from server to ensure we have the latest data
          await refreshTeamMembers();
        } else {
          console.error(`Failed to remove team member with ID: ${stringId}`);
          toast.error("Failed to remove team member", {
            description: "There was an error removing the team member from the project",
          });
          
          // Refresh from server to ensure UI is consistent with server state
          await refreshTeamMembers();
        }
      } else {
        const updatedTeam = teamMembers.filter(member => member.id.toString() !== stringId);
        setTeamMembers(updatedTeam);
        toast("Team member removed", {
          description: "The team member has been removed from the project",
        });
      }
    } catch (error) {
      console.error("Error in handleRemoveMember:", error);
      toast.error("Error removing team member", {
        description: "An unexpected error occurred",
      });
      
      // Refresh to ensure UI is consistent with server state
      await refreshTeamMembers();
    } finally {
      setIsRemoving(null);
    }
  };

  return {
    teamMembers,
    isRefreshing,
    isRemoving,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember
  };
};
