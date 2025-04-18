
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, ProjectRoleKey } from '../types';
import { getProjectManager } from '@/api/projects/modules/team/projectManager';

/**
 * Hook to fetch and manage team member data
 */
export const useTeamDataFetch = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projectManager, setProjectManager] = useState<TeamMember | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) {
      setTeamMembers([]);
      setProjectManager(null);
      return;
    }

    try {
      setIsRefreshing(true);
      console.log('Refreshing team members for project', projectId);

      // Get project manager
      const manager = await getProjectManager(projectId);
      setProjectManager(manager);

      // Fetch project members
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select('id, user_id, project_member_name, role')
        .eq('project_id', projectId)
        .is('left_at', null);

      if (membersError) {
        console.error('Error fetching project members:', membersError);
        setIsRefreshing(false);
        return;
      }

      // For each member with a user_id, get their role
      const teamWithRoles = await Promise.all(
        (members || []).map(async (member) => {
          if (member.user_id) {
            try {
              // Get user's role in this project
              const { data: roleData, error: roleError } = await supabase
                .from('user_project_roles')
                .select('project_roles(role_key)')
                .eq('user_id', member.user_id)
                .eq('project_id', projectId)
                .maybeSingle();

              if (!roleError && roleData && roleData.project_roles) {
                // Cast the data to the expected structure
                const projectRoles = roleData.project_roles as { role_key: string };
                const roleKey = projectRoles.role_key as ProjectRoleKey || 'team_member';
                
                return {
                  id: member.id,
                  name: member.project_member_name || 'Team Member',
                  role: roleKey,
                  user_id: member.user_id
                };
              }
            } catch (error) {
              console.error('Error fetching role:', error);
            }
          }

          // Default if no role found or no user_id
          return {
            id: member.id,
            name: member.project_member_name || 'Team Member',
            role: member.role || 'team_member',
            user_id: member.user_id
          };
        })
      );

      // If we have a project manager, make sure their role is shown as Project Manager
      const updatedTeamMembers = teamWithRoles.map(member => {
        if (manager && member.user_id === manager.user_id) {
          return { ...member, role: 'project_manager' };
        }
        return member;
      });

      console.log('Refreshed team members:', updatedTeamMembers);
      setTeamMembers(updatedTeamMembers);
    } catch (error) {
      console.error('Exception in refreshTeamMembers:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  useEffect(() => {
    refreshTeamMembers();
  }, [refreshTeamMembers]);

  return {
    teamMembers,
    setTeamMembers,
    projectManager,
    isRefreshing,
    refreshTeamMembers
  };
};
