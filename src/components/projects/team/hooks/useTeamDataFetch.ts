
import { useState, useEffect } from 'react';
import { TeamMember, ProjectRoleKey } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export const useTeamDataFetch = (projectId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Safely extract role_key from API response
  const extractRoleKey = (roleData: any): ProjectRoleKey => {
    if (!roleData) return 'team_member';
    
    // If it's already a string
    if (typeof roleData === 'string') {
      return roleData as ProjectRoleKey;
    }
    
    // If it's an object with a role_key property
    if (typeof roleData === 'object' && roleData.role_key) {
      return roleData.role_key as ProjectRoleKey;
    }
    
    // If it's an array with objects that have role_key
    if (Array.isArray(roleData) && roleData.length > 0 && roleData[0] && roleData[0].role_key) {
      return roleData[0].role_key as ProjectRoleKey;
    }
    
    // Default fallback
    return 'team_member';
  };
  
  const fetchMembers = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await supabase
        .rpc('get_team_members_v3', { p_project_id: projectId });
      
      if (apiError) {
        throw apiError;
      }
      
      if (!data) {
        throw new Error('No data returned from API');
      }
      
      const formattedMembers = data.map((member: any) => ({
        id: member.id,
        name: member.name,
        role: extractRoleKey(member.role),
        user_id: member.user_id,
        joined_at: member.joined_at
      }));
      
      setMembers(formattedMembers);
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message || 'An error occurred while fetching team members');
      toast.error('Error loading team', {
        description: 'Failed to fetch team members',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    if (projectId) {
      fetchMembers();
    } else {
      setMembers([]);
      setIsLoading(false);
    }
  }, [projectId]);
  
  return {
    members,
    isLoading,
    isRefreshing,
    error,
    fetchMembers
  };
};
