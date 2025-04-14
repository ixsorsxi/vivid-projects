
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '@/api/projects/modules/team/types';
import { fetchTeamMembersWithPermissions, checkProjectAccess } from '@/api/projects/modules/team/team-permissions';
import { addProjectTeamMember } from '@/api/projects/modules/team/operations/addProjectTeamMember';
import { removeProjectTeamMember } from '@/api/projects/modules/team/operations/removeProjectTeamMember';
import { toast } from '@/components/ui/toast-wrapper';
import { debugLog, debugError } from '@/utils/debugLogger';

export const useTeamAccess = (projectId: string | undefined) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);

  // Function to fetch team members
  const fetchTeamMembers = useCallback(async () => {
    if (!projectId) {
      setTeamMembers([]);
      setError(new Error('No project ID provided'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      debugLog('useTeamAccess', 'Checking project access for:', projectId);
      
      // First check if user has access to this project
      const accessGranted = await checkProjectAccess(projectId);
      setHasAccess(accessGranted);
      
      if (!accessGranted) {
        setTeamMembers([]);
        debugLog('useTeamAccess', 'Access denied to project:', projectId);
        return;
      }
      
      // Then fetch team members using our new safe function
      debugLog('useTeamAccess', 'Fetching team members for project:', projectId);
      
      try {
        // Try to use the new non-recursive function
        const { data, error } = await supabase.rpc(
          'get_team_members_safe',
          { p_project_id: projectId }
        );
        
        if (!error && data) {
          debugLog('useTeamAccess', `Fetched ${data.length} team members via safe RPC`);
          setTeamMembers(data);
          setIsLoading(false);
          return;
        }
        
        if (error) {
          debugError('useTeamAccess', 'Error with safe RPC, trying fallback:', error);
        }
      } catch (rpcErr) {
        debugError('useTeamAccess', 'Exception in RPC call:', rpcErr);
      }
      
      // Fallback: Use the standard utility function
      const members = await fetchTeamMembersWithPermissions(projectId);
      setTeamMembers(members);
      debugLog('useTeamAccess', `Fetched ${members.length} team members with fallback`);
    } catch (err) {
      debugError('useTeamAccess', 'Error fetching team members:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch team members'));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Fetch team members on component mount and when projectId changes
  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Function to add a team member
  const handleAddMember = async (member: { name: string; role: string; email?: string; user_id: string }) => {
    if (!projectId) {
      toast.error('No project selected', {
        description: 'Cannot add team member without a project ID'
      });
      return false;
    }

    setIsAddingMember(true);
    
    try {
      debugLog('useTeamAccess', 'Adding team member:', member, 'to project:', projectId);
      
      // Call the API function to add the member
      await addProjectTeamMember(projectId, {
        name: member.name,
        role: member.role,
        user_id: member.user_id,
        email: member.email
      });
      
      // Refresh the team members list
      await fetchTeamMembers();
      
      toast.success('Team member added', {
        description: `${member.name} has been added to the project team`
      });
      
      return true;
    } catch (err) {
      debugError('useTeamAccess', 'Error adding team member:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      toast.error('Failed to add team member', {
        description: errorMessage
      });
      
      return false;
    } finally {
      setIsAddingMember(false);
    }
  };

  // Function to remove a team member
  const handleRemoveMember = async (memberId: string) => {
    if (!projectId) {
      toast.error('No project selected', {
        description: 'Cannot remove team member without a project ID'
      });
      return false;
    }

    setIsRemovingMember(true);
    
    try {
      debugLog('useTeamAccess', 'Removing team member:', memberId, 'from project:', projectId);
      
      // Call the API function to remove the member
      await removeProjectTeamMember(projectId, memberId);
      
      // Refresh the team members list
      await fetchTeamMembers();
      
      toast.success('Team member removed', {
        description: 'The team member has been removed from the project'
      });
      
      return true;
    } catch (err) {
      debugError('useTeamAccess', 'Error removing team member:', err);
      
      toast.error('Failed to remove team member', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
      
      return false;
    } finally {
      setIsRemovingMember(false);
    }
  };

  return {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    isAddingMember,
    isRemovingMember,
    fetchTeamMembers,
    handleAddMember,
    handleRemoveMember
  };
};
