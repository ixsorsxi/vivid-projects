
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';
import { ProjectRoleKey, getUserProjectRole } from './permissions';

/**
 * Fetches team members with a workaround for RLS issues
 */
export const fetchProjectTeamMembersWithRlsBypass = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // Try to call the RPC function which bypasses RLS
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_project_team_members',
      { p_project_id: projectId }
    );
    
    if (!rpcError && rpcData && Array.isArray(rpcData)) {
      console.log('Successfully fetched team members with RPC:', rpcData.length);
      
      return rpcData.map((member: any) => ({
        id: member.id,
        name: member.name || 'Team Member',
        role: member.role || 'team_member',
        user_id: member.user_id,
        joined_at: member.joined_at,
        left_at: member.left_at
      }));
    }
    
    console.warn('RPC method failed, falling back to direct query with RLS bypass');
    
    // If RPC fails, try direct query as superuser
    const { data: members, error: membersError } = await supabase.rpc(
      'admin_get_project_members',
      { p_project_id: projectId }
    );
    
    if (membersError) {
      console.error('All RLS bypass methods failed:', membersError);
      return [];
    }
    
    return Array.isArray(members) ? members.map((m: any) => ({
      id: m.id,
      name: m.project_member_name || 'Team Member',
      role: m.role || 'team_member',
      user_id: m.user_id
    })) : [];
  } catch (error) {
    console.error('Exception in fetchProjectTeamMembersWithRlsBypass:', error);
    return [];
  }
};

/**
 * Gets a user's role in a project using an RLS bypass method
 */
export const getUserRoleWithRlsBypass = async (
  userId: string,
  projectId: string
): Promise<ProjectRoleKey | null> => {
  try {
    // Try the regular method first
    const regularRole = await getUserProjectRole(userId, projectId);
    if (regularRole) return regularRole;
    
    // If that fails, try the RLS bypass method
    const { data, error } = await supabase.rpc(
      'admin_get_user_project_role',
      { p_user_id: userId, p_project_id: projectId }
    );
    
    if (error) {
      console.error('Error in getUserRoleWithRlsBypass:', error);
      return null;
    }
    
    return data as ProjectRoleKey;
  } catch (error) {
    console.error('Exception in getUserRoleWithRlsBypass:', error);
    return null;
  }
};
