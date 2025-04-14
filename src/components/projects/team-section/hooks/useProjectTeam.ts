
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';

export interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const useProjectTeam = (projectId: string) => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  // Check project access and fetch team members
  const fetchTeamMembers = async () => {
    if (!projectId || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsRetrying(true);
      setError(null);
      
      // Check if the user has access to this project
      const { data: accessData, error: accessError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .maybeSingle();
      
      // Also check if the user is a member of this project
      const { data: membershipData, error: membershipError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      // Set access status
      setHasAccess(!!accessData || !!membershipData);
      
      if (accessError && !membershipData) {
        console.error('Error checking project access:', accessError);
        setError(new Error('Could not verify project access'));
        setIsLoading(false);
        setIsRetrying(false);
        return;
      }
      
      if (!accessData && !membershipData) {
        setTeamMembers([]);
        setIsLoading(false);
        setIsRetrying(false);
        return;
      }
      
      // Fetch team members
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select(`
          id, 
          user_id,
          role,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('project_id', projectId);
      
      if (membersError) {
        console.error('Error fetching team members:', membersError);
        setError(new Error('Failed to load team members'));
        setTeamMembers([]);
      } else {
        // Transform the data to include profile information
        const formattedMembers = members.map((member) => ({
          id: member.id,
          user_id: member.user_id,
          role: member.role,
          profile: member.profiles || {}
        }));
        
        setTeamMembers(formattedMembers);
      }
    } catch (err) {
      console.error('Exception in fetchTeamMembers:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [projectId, user]);

  // Add a new team member
  const addTeamMember = async (userId: string, role: string = 'member') => {
    try {
      // First make sure the user isn't already a member
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingMember) {
        toast.error('User is already a member of this project');
        return false;
      }
      
      // Add the new team member
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userId,
          role
        });
        
      if (error) {
        console.error('Error adding team member:', error);
        toast.error('Failed to add team member');
        return false;
      }
      
      toast.success('Team member added successfully');
      fetchTeamMembers(); // Refresh the team list
      return true;
    } catch (err) {
      console.error('Exception in addTeamMember:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Remove a team member
  const removeTeamMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);
        
      if (error) {
        console.error('Error removing team member:', error);
        toast.error('Failed to remove team member');
        return false;
      }
      
      toast.success('Team member removed successfully');
      // Update the local state to remove the member
      setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
      return true;
    } catch (err) {
      console.error('Exception in removeTeamMember:', err);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  return {
    teamMembers,
    isLoading,
    error,
    hasAccess,
    isRetrying,
    refreshTeam: fetchTeamMembers,
    addTeamMember,
    removeTeamMember
  };
};
