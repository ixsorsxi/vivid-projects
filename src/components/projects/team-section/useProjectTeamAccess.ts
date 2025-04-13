
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/api/projects/modules/team/types';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchTeamMembersWithPermissions } from '@/api/projects/modules/team/team-permissions';
import { debugLog, debugError } from '@/utils/debugLogger';

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
      debugLog('TEAM-ACCESS', 'Checking access for project:', projectId);
      
      // Use the safe RPC function to check access
      const { data: accessData, error: accessError } = await supabase.rpc(
        'direct_project_access',
        { p_project_id: projectId }
      );
      
      if (accessError) {
        debugError('TEAM-ACCESS', 'Error checking project access:', accessError);
        return false;
      }
      
      if (accessData === true) {
        debugLog('TEAM-ACCESS', 'User has direct access to project');
        setHasAccess(true);
        return true;
      }
      
      // As a fallback, check if user is a team member
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .is('left_at', null)
        .maybeSingle();
      
      if (memberError) {
        debugError('TEAM-ACCESS', 'Error checking team membership:', memberError);
      } else if (memberData) {
        debugLog('TEAM-ACCESS', 'User is a team member of the project');
        setHasAccess(true);
        return true;
      }
      
      debugLog('TEAM-ACCESS', 'User does not have access to this project');
      setHasAccess(false);
      return false;
    } catch (err) {
      debugError('TEAM-ACCESS', 'Exception checking project access:', err);
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
      debugLog('TEAM-ACCESS', 'Fetching team members for project:', projectId);
      
      // First check if user has access
      const hasProjectAccess = await checkAccess();
      
      if (!hasProjectAccess) {
        debugLog('TEAM-ACCESS', 'User does not have access to this project');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Try to use the get_team_members_v3 RPC function first
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'get_team_members_v3',
          { p_project_id: projectId }
        );
        
        if (!rpcError && rpcData) {
          debugLog('TEAM-ACCESS', 'Successfully fetched team members via RPC:', rpcData);
          setTeamMembers(rpcData);
          setIsLoading(false);
          return;
        }
        
        if (rpcError) {
          debugError('TEAM-ACCESS', 'RPC error, trying fallback:', rpcError);
        }
      } catch (rpcErr) {
        debugError('TEAM-ACCESS', 'Exception in RPC call:', rpcErr);
      }
      
      // If RPC fails, use the direct query with special handling
      try {
        const { data: memberData, error: memberError } = await supabase
          .from('project_members')
          .select('id, user_id, project_member_name, role, joined_at')
          .eq('project_id', projectId)
          .is('left_at', null);
        
        if (memberError) {
          if (memberError.message.includes('infinite recursion')) {
            debugError('TEAM-ACCESS', 'Detected infinite recursion in policy, using fetchTeamMembersWithPermissions');
            
            // As a last resort, use our special utility for fetching team members
            const members = await fetchTeamMembersWithPermissions(projectId);
            debugLog('TEAM-ACCESS', 'Fetched team members with custom utility:', members);
            setTeamMembers(members);
            setIsLoading(false);
            return;
          } else {
            throw memberError;
          }
        } else if (memberData) {
          const members: TeamMember[] = memberData.map(member => ({
            id: member.id,
            name: member.project_member_name || 'Unknown Member',
            role: member.role || 'team_member',
            user_id: member.user_id,
            joined_at: member.joined_at
          }));
          
          debugLog('TEAM-ACCESS', 'Fetched team members with direct query:', members);
          setTeamMembers(members);
          setIsLoading(false);
          return;
        }
      } catch (queryErr) {
        debugError('TEAM-ACCESS', 'Exception in direct query:', queryErr);
        throw queryErr;
      }
      
      // If all else fails
      throw new Error('All methods for fetching team members failed');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching team members');
      debugError('TEAM-ACCESS', 'Exception in fetchTeamMembers:', error);
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
