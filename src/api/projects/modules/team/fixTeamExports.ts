
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';

/**
 * Fetches team members with their permissions using a security definer function
 * This avoids the recursive RLS policy issue
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Using security definer approach to fetch team members for project:', projectId);
    
    // Call the RPC function that uses SECURITY DEFINER to bypass RLS
    const { data, error } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error fetching team members with permissions:', error);
      
      // First fallback: try direct query if the user is the project owner
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .maybeSingle();
      
      if (!projectError && projectData) {
        const { data: { user } } = await supabase.auth.getUser();
        
        // If user is project owner, try direct query bypassing RLS
        if (user && projectData.user_id === user.id) {
          console.log('User is project owner, attempting direct query');
          
          const { data: directData, error: directError } = await supabase.rpc(
            'direct_project_access',
            { p_project_id: projectId }
          );
          
          if (!directError && directData) {
            const { data: membersData, error: membersError } = await supabase
              .from('project_members')
              .select('id, project_member_name, role, user_id')
              .eq('project_id', projectId)
              .is('left_at', null);
            
            if (!membersError && membersData) {
              return membersData.map(member => ({
                id: member.id,
                name: member.project_member_name || 'Team Member',
                role: member.role || 'team_member',
                user_id: member.user_id
              }));
            }
          }
        }
      }
      
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    console.log('Successfully fetched team members via RPC function:', data);
    
    // Transform data to match TeamMember type
    return data.map((member: any) => ({
      id: member.id,
      name: member.name || 'Team Member',
      role: member.role || 'team_member',
      user_id: member.user_id,
      permissions: member.permissions
    }));
  } catch (error) {
    console.error('Exception in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};

/**
 * Alternative approach to fetch team members using the project ownership check
 * This avoids the recursive RLS policy by checking if user is project owner first
 */
export const fetchTeamMembersAsOwner = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user:', userError);
      return [];
    }
    
    // Check if user is project owner
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (projectError) {
      console.error('Error checking project ownership:', projectError);
      return [];
    }
    
    // If user is project owner, use direct query
    if (projectData && projectData.user_id === user.id) {
      console.log('User is project owner, querying members directly');
      
      // Direct query that bypasses the problematic RLS policy
      const { data: membersData, error: membersError } = await supabase
        .from('project_members')
        .select('id, project_member_name, role, user_id')
        .eq('project_id', projectId)
        .is('left_at', null);
      
      if (membersError) {
        console.error('Error fetching members as owner:', membersError);
        return [];
      }
      
      if (!membersData) {
        return [];
      }
      
      return membersData.map(member => ({
        id: member.id,
        name: member.project_member_name || 'Team Member',
        role: member.role || 'team_member',
        user_id: member.user_id
      }));
    } else {
      // User is not project owner, try the security definer function
      return fetchTeamMembersWithPermissions(projectId);
    }
  } catch (error) {
    console.error('Exception in fetchTeamMembersAsOwner:', error);
    return [];
  }
};
