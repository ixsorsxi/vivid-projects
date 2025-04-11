
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, ProjectRoleKey } from './types';

/**
 * Fetches team members with their permissions for a project
 * Uses the most reliable method for the current database schema
 */
export const fetchTeamMembersWithPermissions = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // First try using the RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_project_team_with_permissions',
      { p_project_id: projectId }
    );
    
    if (!rpcError && rpcData) {
      return rpcData.map((member: any) => ({
        id: member.id,
        name: member.name || 'Team Member',
        role: member.role || 'team_member',
        user_id: member.user_id,
        permissions: member.permissions
      }));
    }
    
    // Fallback to direct queries
    const { data: members, error: membersError } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (membersError || !members) {
      console.error('Error fetching team members:', membersError);
      return [];
    }
    
    // For each member, fetch their role from user_project_roles
    return await Promise.all(members.map(async member => {
      let role: ProjectRoleKey = 'team_member';
      let permissions: string[] = [];
      
      if (member.user_id) {
        // Get role
        const { data: roleData, error: roleError } = await supabase
          .from('user_project_roles')
          .select('project_roles!inner(role_key)')
          .eq('user_id', member.user_id)
          .eq('project_id', projectId)
          .maybeSingle();
        
        if (!roleError && roleData && roleData.project_roles) {
          role = roleData.project_roles.role_key as ProjectRoleKey;
        }
        
        // Get permissions
        const { data: permData, error: permError } = await supabase.rpc(
          'get_user_project_permissions',
          { p_user_id: member.user_id, p_project_id: projectId }
        );
        
        if (!permError && permData) {
          // Extract permission names from the returned data
          if (Array.isArray(permData)) {
            if (permData.length > 0 && typeof permData[0] === 'string') {
              permissions = permData;
            } else if (permData.length > 0 && typeof permData[0] === 'object' && 'permission_name' in permData[0]) {
              // Extract just the permission_name strings from each object
              permissions = permData.map((item: { permission_name: string }) => String(item.permission_name));
            }
          }
        }
      }
      
      return {
        id: member.id,
        name: member.project_member_name || 'Team Member',
        role,
        user_id: member.user_id,
        permissions
      };
    }));
  } catch (error) {
    console.error('Error in fetchTeamMembersWithPermissions:', error);
    return [];
  }
};

/**
 * Helper function to fix RLS policies for team access
 */
export const fixRlsPolicy = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'check_project_member_access_safe',
      { p_project_id: projectId }
    );
    
    return !!data && !error;
  } catch (error) {
    console.error('Error in fixRlsPolicy:', error);
    return false;
  }
};
