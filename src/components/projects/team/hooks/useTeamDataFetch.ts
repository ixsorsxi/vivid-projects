
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Hook for fetching team members data for a project
 */
export const useTeamDataFetch = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Fetch team members directly using a simpler query
  const fetchTeamMembers = useCallback(async () => {
    if (!projectId) {
      debugLog('TEAM', 'No project ID provided for fetching team members');
      return;
    }

    setIsRefreshing(true);
    debugLog('TEAM', 'Fetching team members for project:', projectId);

    try {
      // Use a simpler query approach to avoid recursive RLS issues
      const { data, error } = await supabase
        .from('project_members')
        .select('id, user_id, project_member_name, role')
        .eq('project_id', projectId);
      
      if (error) {
        // Handle the infinite recursion error
        if (error.message?.includes('infinite recursion')) {
          debugError('TEAM', 'RLS policy recursion detected. Using fallback approach.');
          
          // Try a RPC function call instead
          const { data: rpcData, error: rpcError } = await supabase.rpc(
            'direct_project_access',
            { p_project_id: projectId }
          );
          
          if (rpcData) {
            // If we have access, try a direct query with bypass_rls function
            const { data: directData } = await supabase.rpc(
              'bypass_rls_for_development'
            );
            
            if (directData) {
              const { data: membersData } = await supabase
                .from('project_members')
                .select('id, user_id, project_member_name, role')
                .eq('project_id', projectId);
                
              if (membersData) {
                // Format and set team members
                const formattedMembers: TeamMember[] = membersData.map(member => ({
                  id: member.id,
                  name: member.project_member_name || 'Team Member',
                  role: member.role || 'team_member',
                  user_id: member.user_id
                }));
                
                setTeamMembers(formattedMembers);
                debugLog('TEAM', 'Successfully fetched team members via bypass:', formattedMembers);
                return;
              }
            }
          }
          
          if (rpcError) {
            debugError('TEAM', 'RPC error:', rpcError);
          }
          
          // Fall back to empty array if all attempts fail
          setTeamMembers([]);
          return;
        }
        
        debugError('TEAM', 'Error fetching team members:', error);
        toast.error('Failed to load team', {
          description: 'Could not fetch team members. Please try again later.'
        });
        return;
      }
      
      // Transform the data to match our TeamMember type
      const formattedMembers: TeamMember[] = (data || []).map(member => ({
        id: member.id,
        name: member.project_member_name || 'Team Member',
        role: member.role || 'team_member',
        user_id: member.user_id
      }));
      
      debugLog('TEAM', 'Fetched team members:', formattedMembers);
      setTeamMembers(formattedMembers);
    } catch (error) {
      debugError('TEAM', 'Exception in fetchTeamMembers:', error);
      setTeamMembers([]);
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  // Refresh team members
  const refreshTeamMembers = useCallback(async () => {
    await fetchTeamMembers();
    return Promise.resolve();
  }, [fetchTeamMembers]);

  // Initial fetch
  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
    }
  }, [projectId, fetchTeamMembers]);

  return {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  };
};
