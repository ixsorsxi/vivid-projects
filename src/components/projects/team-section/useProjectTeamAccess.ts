
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

  // Check if user has access to this project using direct methods
  // that don't rely on potentially problematic RLS policies
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

      // Strategy 1: Check if user is project owner (most reliable, no RLS)
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .maybeSingle();
      
      if (!projectError && projectData && projectData.user_id === user.id) {
        console.log('User is project owner - access granted');
        setHasAccess(true);
        return true;
      }
      
      // Strategy 2: Check if user is admin via direct profile check
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      if (!profileError && profileData && profileData.role === 'admin') {
        console.log('User is admin - access granted');
        setHasAccess(true);
        return true;
      }
      
      // Strategy 3: Try RPC function to check membership (bypassing RLS)
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'check_project_member_access_safe',
        { p_project_id: projectId }
      );
      
      if (!rpcError && rpcData === true) {
        console.log('RPC function confirmed access');
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
  // to avoid RLS recursion issues
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
      
      // Get current user for logging
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Fetching team members for project:', projectId, 'as user:', user?.id);
      
      // Method 1: Try using the new secure RPC function first
      const { data: safeData, error: safeError } = await supabase.rpc(
        'get_project_team_members_safe',
        { p_project_id: projectId }
      );
      
      if (!safeError && safeData) {
        console.log('Successfully fetched team members via safe RPC');
        
        const members = safeData.map((member: any) => ({
          id: member.id,
          name: member.name || 'Team Member',
          role: member.role || 'team_member',
          user_id: member.user_id
        }));
        
        setTeamMembers(members);
        setIsLoading(false);
        return;
      }
      
      if (safeError) {
        console.error('Safe RPC error:', safeError);
      }
      
      // Method 2: Try using the permissions RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'get_project_team_with_permissions',
        { p_project_id: projectId }
      );
      
      if (!rpcError && rpcData) {
        console.log('Successfully fetched team members via RPC with permissions');
        
        const members = rpcData.map((member: any) => ({
          id: member.id,
          name: member.name || 'Team Member',
          role: member.role || 'team_member',
          user_id: member.user_id,
          permissions: member.permissions
        }));
        
        setTeamMembers(members);
        setIsLoading(false);
        return;
      }
      
      if (rpcError) {
        console.error('RPC error:', rpcError);
      }
      
      // Method 3: Direct query if user is project owner or admin
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setError(new Error('No authenticated user'));
        setIsLoading(false);
        return;
      }
      
      // Check if user is project owner
      const { data: projectData } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .maybeSingle();
      
      // Check if user is admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      const isOwner = projectData?.user_id === currentUser.id;
      const isAdmin = profileData?.role === 'admin';
      
      // If user is project owner or admin, use direct query
      if (isOwner || isAdmin) {
        console.log('User is project owner or admin, using direct query');
        
        // Use direct query without relying on RLS policies
        const { data: directData, error: directError } = await supabase
          .from('project_members')
          .select('id, project_member_name, role, user_id')
          .eq('project_id', projectId)
          .is('left_at', null);
        
        if (directError) {
          console.error('Error with direct query:', directError);
          setError(new Error('Failed to fetch team members'));
        } else if (directData) {
          const members = directData.map(member => ({
            id: member.id,
            name: member.project_member_name || 'Team Member',
            role: member.role || 'team_member',
            user_id: member.user_id
          }));
          
          setTeamMembers(members);
        }
      } else {
        // Method 4: Last resort - try another bypass approach
        console.log('User is not owner or admin, trying alternative approach');
        
        const { data: bypassData, error: bypassError } = await supabase.rpc(
          'direct_project_access',
          { p_project_id: projectId }
        );
        
        if (!bypassError && bypassData) {
          const { data: membersData, error: membersError } = await supabase
            .from('project_members')
            .select('id, project_member_name, role, user_id')
            .eq('project_id', projectId)
            .is('left_at', null);
          
          if (!membersError && membersData) {
            const members = membersData.map(member => ({
              id: member.id,
              name: member.project_member_name || 'Team Member',
              role: member.role || 'team_member',
              user_id: member.user_id
            }));
            
            setTeamMembers(members);
          } else {
            console.error('Error fetching members after bypass:', membersError);
            setError(new Error('Failed to fetch team members'));
          }
        } else {
          console.error('Bypass error:', bypassError);
          setError(new Error('Failed to access project data'));
          setTeamMembers([]);
        }
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
