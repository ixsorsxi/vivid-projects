
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, TeamMemberWithPermissions } from './types';
import { fetchUserProjectPermissions, mapLegacyRole, getRoleDescription } from './rolePermissions';

// Function to fetch project team members
export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);
    
    // Get current user for context
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    if (!currentUser) {
      console.error('No authenticated user found when fetching team members');
      return [];
    }
    
    // Direct query approach - most reliable
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name, role')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    console.log('Retrieved team members:', data);
    
    // Make sure to properly format the member data with correct names
    const members = (data || []).map(member => ({
      id: member.id,
      name: member.project_member_name || 'Team Member',
      role: member.role || 'team_member',
      user_id: member.user_id
    }));

    // Add role descriptions for display purposes
    const membersWithDescriptions = await Promise.all(
      members.map(async (member) => {
        try {
          const roleKey = mapLegacyRole(member.role);
          const roleDescription = await getRoleDescription(roleKey);
          return {
            ...member,
            role_description: roleDescription || undefined
          };
        } catch (error) {
          console.error('Error getting role description:', error);
          return member;
        }
      })
    );
    
    return membersWithDescriptions;
  } catch (error) {
    console.error('Error in fetchProjectTeamMembers:', error);
    return [];
  }
};

// Function to fetch project team members with their permissions
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMemberWithPermissions[]> => {
  try {
    const members = await fetchProjectTeamMembers(projectId);
    
    // Add permissions to each member
    const membersWithPermissions = await Promise.all(
      members.map(async (member) => {
        if (!member.user_id) {
          return { ...member, permissions: [] };
        }
        
        // Only pass projectId here, not user_id
        const permissions = await fetchUserProjectPermissions(projectId);
        
        return {
          ...member,
          permissions
        };
      })
    );
    
    return membersWithPermissions;
  } catch (error) {
    console.error('Error in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};

// Legacy function for backward compatibility
export const fetchTeamManagerName = async (projectId: string): Promise<string | null> => {
  try {
    // Query the projects table for the project manager details
    const { data, error } = await supabase
      .from('projects')
      .select('project_manager_id')
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error('Error fetching project manager details:', error);
      return null;
    }
    
    // If we have a project manager ID, look up their name from profiles
    if (data?.project_manager_id) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', data.project_manager_id)
        .single();
      
      if (userError) {
        console.error('Error fetching project manager profile:', userError);
        return null;
      }
      
      // Return the full name or username
      return userData?.full_name || userData?.username || null;
    }
    
    return null;
  } catch (error) {
    console.error('Exception in fetchTeamManagerName:', error);
    return null;
  }
};
