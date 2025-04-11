
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { getUserProjectRole } from './rolePermissions';

/**
 * Securely fetches team members using Security Definer functions
 * This completely avoids the recursive RLS policy issue
 */
export const getProjectTeamSecurely = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members securely for project:', projectId);
    
    // First attempt: Use the RPC function designed to bypass RLS
    const { data, error } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error using secure RPC method:', error);
      
      // Second attempt: Check if the user is the project owner or admin
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user');
        return [];
      }
      
      // Get project owner ID to compare with current user
      const { data: projectData } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .maybeSingle();
      
      // Get user role to check if admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      const isOwner = projectData?.user_id === user.id;
      const isAdmin = profileData?.role === 'admin';
      
      if (isOwner || isAdmin) {
        console.log('User is project owner or admin, using direct query');
        
        // Use a direct query since owner/admin can bypass RLS
        const { data: membersData, error: membersError } = await supabase
          .from('project_members')
          .select('id, project_member_name, user_id')
          .eq('project_id', projectId)
          .is('left_at', null);
        
        if (membersError) {
          console.error('Error with direct query:', membersError);
          return [];
        }
        
        // Convert to TeamMember objects with roles from user_project_roles
        return await Promise.all((membersData || []).map(async member => {
          let role = 'team_member'; // Default role
          if (member.user_id) {
            const userRole = await getUserProjectRole(member.user_id, projectId);
            if (userRole) {
              role = userRole;
            }
          }
          
          return {
            id: member.id,
            name: member.project_member_name || 'Team Member',
            role: role,
            user_id: member.user_id
          };
        }));
      }
      
      return [];
    }
    
    console.log('Successfully fetched team members via secure RPC');
    
    return (data || []).map((member: any) => ({
      id: member.id,
      name: member.name || 'Team Member',
      role: member.role || 'team_member',
      user_id: member.user_id,
      permissions: member.permissions
    }));
  } catch (error) {
    console.error('Exception in getProjectTeamSecurely:', error);
    return [];
  }
};

/**
 * Check if the current user can access project team data
 * Uses dedicated Security Definer function to avoid recursion
 */
export const checkSecureProjectAccess = async (projectId: string): Promise<boolean> => {
  try {
    // Use RPC function that uses SECURITY DEFINER to bypass RLS
    const { data, error } = await supabase.rpc(
      'check_project_member_access_safe',
      { p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error checking secure project access:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception in checkSecureProjectAccess:', error);
    return false;
  }
};
