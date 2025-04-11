
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/api/projects/modules/team/types';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Custom hook for securely accessing project team data
 * Uses multiple strategies to avoid RLS recursion issues
 */
export const useProjectTeamAccess = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Check if user has access to this project
  const checkAccess = useCallback(async () => {
    if (!projectId) return false;
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        setHasAccess(false);
        return false;
      }

      // Use the safe RPC function to check access
      const { data: accessData, error: accessError } = await supabase.rpc(
        'check_project_member_access_safe',
        { p_project_id: projectId }
      );
      
      if (!accessError && accessData === true) {
        console.log('User has access to project');
        setHasAccess(true);
        return true;
      }
      
      console.log('Access check failed - user does not have access to this project');
      setHasAccess(false);
      return false;
    } catch (err) {
      console.error('Error checking project access:', err);
      setHasAccess(false);
      return false;
    }
  }, [projectId]);

  // Fetch team members using the most reliable method
  const fetchTeamMembers = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if user has access
      const hasProjectAccess = await checkAccess();
      
      if (!hasProjectAccess) {
        console.log('User does not have access to this project');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Use the secure RPC function to get team members
      const { data, error } = await supabase.rpc(
        'get_project_team_with_permissions',
        { p_project_id: projectId }
      );
      
      if (error) {
        console.error('Error fetching team members:', error);
        setError(new Error(error.message));
        setTeamMembers([]);
      } else if (data) {
        // Transform the data to match our TeamMember type
        const members: TeamMember[] = data.map((member: any) => ({
          id: member.id,
          name: member.name || 'Team Member',
          role: member.role || 'team_member',
          user_id: member.user_id,
          permissions: member.permissions
        }));
        
        console.log('Fetched team members:', members);
        setTeamMembers(members);
      } else {
        setTeamMembers([]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching team members');
      console.error('Exception in fetchTeamMembers:', error);
      setError(error);
      
      // Only show toast after multiple attempts to avoid spamming the user
      if (attempts > 1) {
        toast.error('Error loading team', {
          description: 'Failed to load team members. Please try again.'
        });
      }
      
      setAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, checkAccess, attempts]);

  // Initial fetch
  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
      setIsLoading(false);
    }
  }, [projectId, fetchTeamMembers]);

  // Reset attempts when project changes
  useEffect(() => {
    setAttempts(0);
  }, [projectId]);

  return {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    refreshTeamMembers: fetchTeamMembers
  };
};
