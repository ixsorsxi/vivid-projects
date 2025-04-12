import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/api/projects/modules/team/types';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchTeamMembersWithPermissions } from '@/api/projects/modules/team/team-permissions';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team/fetchTeamMembers';

/**
 * Custom hook for team access and member management
 * Uses the improved non-recursive functions
 */
export const useTeamAccess = (projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Check if user has access to this project using the new v2 function
  const verifyAccess = useCallback(async () => {
    if (!projectId) return false;
    
    try {
      const { data: hasAccess, error } = await supabase.rpc(
        'check_project_access_v2',
        { p_project_id: projectId }
      );
      
      if (error) {
        console.error('Error checking project access:', error);
        setHasAccess(false);
        return false;
      }
      
      setHasAccess(!!hasAccess);
      return !!hasAccess;
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
      const hasProjectAccess = await verifyAccess();
      
      if (!hasProjectAccess) {
        console.log('User does not have access to this project');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }
      
      // Use the new non-recursive function to get team members
      try {
        const { data: members, error } = await supabase.rpc(
          'get_project_members_v2',
          { p_project_id: projectId }
        );
        
        if (!error && members) {
          console.log('Fetched team members using new function:', members);
          
          // Transform to TeamMember format
          const formattedMembers = members.map(member => ({
            id: member.id,
            name: member.project_member_name || 'Team Member',
            role: member.role || 'team_member',
            user_id: member.user_id
          }));
          
          setTeamMembers(formattedMembers);
          setIsLoading(false);
          return;
        }
      } catch (rpcError) {
        console.error('Error with RPC get_project_members_v2:', rpcError);
      }
      
      // Fall back to permission-based function if RPC fails
      try {
        const members = await fetchTeamMembersWithPermissions(projectId);
        if (members && members.length > 0) {
          console.log('Fetched team members with permissions:', members);
          setTeamMembers(members);
          setIsLoading(false);
          return;
        }
      } catch (permissionsError) {
        console.error('Error fetching with permissions, falling back:', permissionsError);
      }
      
      // Final fallback to direct fetching method
      const directMembers = await fetchProjectTeamMembers(projectId);
      console.log('Fetched team members directly:', directMembers);
      setTeamMembers(directMembers);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching team members');
      console.error('Exception in fetchTeamMembers:', error);
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
      console.log('Adding team member:', member);
      setIsAddingMember(true);
      
      // Use the RPC function directly which should bypass RLS issues
      const { data, error } = await supabase.rpc(
        'add_project_member',
        { 
          p_project_id: projectId,
          p_user_id: member.user_id,
          p_name: member.name,
          p_role: member.role,
          p_email: null // Optional parameter
        }
      );
      
      if (error) {
        console.error('Error adding team member:', error);
        
        if (error.message.includes('already a member')) {
          toast.error('User already a member', {
            description: 'This user is already a member of the project.'
          });
        } else {
          toast.error('Failed to add team member', {
            description: error.message
          });
        }
        return false;
      }
      
      await fetchTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Exception in handleAddMember:', error);
      toast.error('Failed to add team member', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!projectId) return false;
    
    try {
      console.log('Removing team member:', memberId);
      
      // Use the RPC function to bypass RLS issues
      const { data, error } = await supabase.rpc(
        'remove_project_member',
        { 
          p_project_id: projectId,
          p_member_id: memberId
        }
      );
      
      if (error) {
        console.error('Error removing team member:', error);
        toast.error('Failed to remove team member', {
          description: error.message
        });
        return false;
      }
      
      toast.success('Team member removed');
      await fetchTeamMembers();
      return true;
    } catch (error: any) {
      console.error('Exception in handleRemoveMember:', error);
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
