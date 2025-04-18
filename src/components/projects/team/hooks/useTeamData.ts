
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, ProjectRoleKey } from '../types';

/**
 * Fetches team members with their roles for a project
 */
export const useTeamData = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!projectId) {
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch project members
        const { data: members, error: membersError } = await supabase
          .from('project_members')
          .select('id, user_id, project_member_name, role')
          .eq('project_id', projectId);

        if (membersError) throw new Error(membersError.message);

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
                  const roleKey = roleData.project_roles.role_key;
                  if (roleKey) {
                    return {
                      id: member.id,
                      name: member.project_member_name || 'Team Member',
                      role: roleKey as ProjectRoleKey,
                      user_id: member.user_id
                    };
                  }
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

        setTeamMembers(teamWithRoles);
      } catch (error) {
        console.error('Error in useTeamData:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [projectId]);

  return { teamMembers, isLoading, error };
};
