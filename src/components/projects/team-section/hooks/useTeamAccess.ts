
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/api/projects/modules/team/types';
import { toast } from '@/components/ui/toast-wrapper';
import { getProjectTeamMembers } from '@/api/projects/modules/team/operations/getProjectTeamMembers';
import { addProjectTeamMember } from '@/api/projects/modules/team/operations';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Custom hook for team access and member management
 * Uses improved non-recursive functions
 */
export const useTeamAccess = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Check if user has access to this project using a security definer function
  const verifyAccess = useCallback(async () => {
    if (!projectId) return false;
    
    try {
      debugLog('useTeamAccess', 'Checking project access for project:', projectId);
      
      // Use the new v3 function with proper typing
      const { data: hasAccess, error: accessError } = await supabase.rpc(
        'check_project_access_v3',
        { p_project_id: projectId }
      );
      
      if (accessError) {
        debugError('useTeamAccess', 'Error with check_project_access_v3:', accessError);
        
        // Fallback to simpler check
        const { data: directCheck, error: directError } = await supabase.rpc(
          'direct_project_access',
          { p_project_id: projectId }
        );
        
        if (directError) {
          debugError('useTeamAccess', 'Error with direct_project_access:', directError);
          setHasAccess(false);
          return false;
        }
        
        setHasAccess(!!directCheck);
        return !!directCheck;
      }
      
      debugLog('useTeamAccess', 'Access check result:', hasAccess);
      setHasAccess(!!hasAccess);
      return !!hasAccess;
    } catch (err) {
      debugError('useTeamAccess', 'Exception in verifyAccess:', err);
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
      const hasProjectAccess = await verifyAccess();
      
      if (!hasProjectAccess) {
        debugLog('useTeamAccess', 'User does not have access to project:', projectId);
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Use the secure getProjectTeamMembers function
      try {
        debugLog('useTeamAccess', 'Fetching team members for project:', projectId);
        const members = await getProjectTeamMembers(projectId);
        
        if (members) {
          debugLog('useTeamAccess', `Retrieved ${members.length} team members`);
          setTeamMembers(members);
        } else {
          debugLog('useTeamAccess', 'No team members found, setting empty array');
          setTeamMembers([]);
        }
      } catch (fetchError) {
        debugError('useTeamAccess', 'Error fetching team members:', fetchError);
        setTeamMembers([]);
        throw fetchError;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching team members');
      debugError('useTeamAccess', 'Exception in fetchTeamMembers:', error);
      setError(error);
      
      toast.error('Error loading team', {
        description: 'Failed to load team members. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, verifyAccess]);

  // Initial fetch
  useEffect(() => {
    if (projectId) {
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
      setIsLoading(false);
    }
  }, [projectId, fetchTeamMembers]);

  const handleAddMember = async (member: { name: string; role: string; user_id: string }): Promise<boolean> => {
    if (!projectId) {
      toast.error('Project ID is required');
      return false;
    }
    
    try {
      debugLog('useTeamAccess', 'Adding team member:', member);
      setIsAddingMember(true);
      
      // Use the dedicated addProjectTeamMember function
      await addProjectTeamMember(projectId, {
        name: member.name,
        role: member.role,
        user_id: member.user_id
      });
      
      debugLog('useTeamAccess', 'Team member added successfully');
      
      // Refresh the team members list
      await fetchTeamMembers();
      
      return true;
    } catch (error: any) {
      debugError('useTeamAccess', 'Exception in handleAddMember:', error);
      
      // Re-throw error to allow handling at UI level
      throw error;
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId: string): Promise<boolean> => {
    if (!projectId) {
      toast.error('Project ID is required');
      return false;
    }
    
    try {
      debugLog('useTeamAccess', 'Removing team member:', memberId);
      
      // Use the RPC function to remove the member
      const { data, error } = await supabase.rpc(
        'remove_project_member',
        { 
          p_project_id: projectId,
          p_member_id: memberId
        }
      );
      
      if (error) {
        debugError('useTeamAccess', 'Error removing team member:', error);
        toast.error('Failed to remove team member', {
          description: error.message
        });
        return false;
      }
      
      // Refresh the team list
      await fetchTeamMembers();
      return true;
    } catch (error: any) {
      debugError('useTeamAccess', 'Exception in handleRemoveMember:', error);
      toast.error('Failed to remove team member', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    }
  };

  return {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    isAddingMember,
    refreshTeamMembers: fetchTeamMembers,
    handleAddMember,
    handleRemoveMember
  };
};
