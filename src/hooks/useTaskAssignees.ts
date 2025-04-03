
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export interface TaskAssignee {
  id: string;
  name: string;
  avatar?: string;
}

export const useTaskAssignees = (projectId?: string) => {
  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignees = async () => {
      setLoading(true);
      try {
        console.log('Fetching assignees for project:', projectId);
        
        // If we have a projectId, fetch team members for this project
        if (projectId) {
          console.log('Fetching project members for project ID:', projectId);
          
          const { data: projectMembers, error: projectError } = await supabase
            .from('project_members')
            .select('id, user_id, project_member_name, role')
            .eq('project_id', projectId);

          if (projectError) {
            console.error('Error fetching project members:', projectError);
            throw projectError;
          }

          console.log('Project members retrieved:', projectMembers);

          // If we have project members, fetch their profiles
          if (projectMembers && projectMembers.length > 0) {
            // Get the user_ids from project members
            const userIds = projectMembers
              .filter(member => member.user_id)
              .map(member => member.user_id);

            console.log('User IDs extracted from project members:', userIds);

            // If we have any user_ids, fetch their profiles
            if (userIds.length > 0) {
              const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

              if (profilesError) {
                console.error('Error fetching profiles:', profilesError);
                throw profilesError;
              }

              console.log('Profiles retrieved:', profiles);

              // Map profiles to assignees
              const profileAssignees = profiles.map(profile => ({
                id: profile.id,
                name: profile.full_name || 'Unknown',
                avatar: profile.avatar_url || undefined
              }));

              // Map project members who don't have a user_id (external members)
              const externalAssignees = projectMembers
                .filter(member => !member.user_id)
                .map(member => ({
                  id: member.id,
                  name: member.project_member_name || 'External Member',
                  avatar: undefined
                }));

              console.log('Combined assignees:', [...profileAssignees, ...externalAssignees]);
              setAssignees([...profileAssignees, ...externalAssignees]);
              setLoading(false);
              return;
            }
          }

          // If no project members with user_ids or projectId not provided, use the project_members names
          if (projectMembers) {
            console.log('Using project members as assignees:', projectMembers);
            setAssignees(
              projectMembers.map(member => ({
                id: member.id,
                name: member.project_member_name || 'Team Member',
                avatar: undefined
              }))
            );
            setLoading(false);
            return;
          }
        }

        // Fallback to fetching all profiles if no projectId or no project members found
        console.log('Falling back to fetching all profiles');
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .order('full_name');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load team members', {
            description: 'Could not fetch profiles from the database'
          });
          setAssignees([]);
        } else {
          console.log('All profiles retrieved:', profiles);
          setAssignees(
            profiles.map(profile => ({
              id: profile.id,
              name: profile.full_name || 'Unknown',
              avatar: profile.avatar_url || undefined
            }))
          );
        }
      } catch (error) {
        console.error('Error in useTaskAssignees:', error);
        toast.error('Failed to load assignees', {
          description: 'An error occurred while fetching assignees'
        });
        setAssignees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignees();
  }, [projectId]);

  return { assignees, loading };
};
