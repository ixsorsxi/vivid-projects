
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/api/projects/modules/team/types';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';
import { fetchTeamMembersWithPermissions } from '@/api/projects/modules/team/team-permissions';
import { getUserProjectRole } from '@/api/projects/modules/team/permissions';

export const useProjectTeam = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchTeamMembers = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use our optimized function to get team members with permissions
      const members = await fetchTeamMembersWithPermissions(projectId);
      console.log('Fetched team members:', members);
      setTeamMembers(members);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error fetching team members');
      console.error('Error in fetchTeamMembers:', error);
      setError(error);
      
      toast.error('Error loading team', {
        description: 'Failed to load team members. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const addTeamMember = async (userId: string, name: string): Promise<boolean> => {
    if (!projectId) return false;
    
    try {
      // Insert into project_members
      const { data, error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userId,
          project_member_name: name,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding team member:', error);
        return false;
      }

      // Get the current user's role for this project 
      if (user) {
        const userRole = await getUserProjectRole(user.id, projectId);
        
        // By default, add new members as team_members
        const { error: roleError } = await supabase.rpc(
          'assign_project_role',
          {
            p_user_id: userId,
            p_project_id: projectId,
            p_role_key: 'team_member'
          }
        );
        
        if (roleError) {
          console.error('Error assigning default role to new member:', roleError);
        }
      }

      // Update the local state
      const newMember: TeamMember = {
        id: data.id,
        name: name,
        user_id: userId,
        role: 'team_member',
        permissions: []
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      
      toast.success('Team member added', {
        description: `${name} has been added to the project team.`
      });
      
      return true;
    } catch (error) {
      console.error('Error in addTeamMember:', error);
      
      toast.error('Failed to add team member', {
        description: 'An error occurred while adding the team member.'
      });
      
      return false;
    }
  };

  // Initial fetch and refresh mechanism
  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
      setIsLoading(false);
    }
  }, [projectId, fetchTeamMembers]);

  return {
    teamMembers,
    isLoading,
    error,
    fetchTeamMembers,
    addTeamMember
  };
};
