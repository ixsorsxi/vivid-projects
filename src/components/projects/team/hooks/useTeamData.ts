
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
}

export const useTeamData = (projectId: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      if (data && data.user) {
        setCurrentUser(data.user.id);
      }
    });

    fetchTeamMembers();
  }, [projectId]);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select('id, user_id, project_member_name')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch the role for each member from user_project_roles
      const membersWithRoles = await Promise.all(data.map(async member => {
        let role = 'team_member'; // Default role
        
        if (member.user_id) {
          const { data: roleData, error: roleError } = await supabase
            .from('user_project_roles')
            .select('project_roles!inner(role_key)')
            .eq('user_id', member.user_id)
            .eq('project_id', projectId)
            .maybeSingle();
          
          if (!roleError && roleData) {
            role = roleData.project_roles.role_key;
          }
        }
        
        return {
          id: member.id,
          user_id: member.user_id,
          name: member.project_member_name || 'Unnamed Member',
          role: role
        };
      }));
      
      setTeamMembers(membersWithRoles);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    teamMembers,
    isLoading,
    currentUser,
    fetchTeamMembers
  };
};

export default useTeamData;
