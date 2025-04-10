
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './types';

/**
 * Gets all team members for a project using the most reliable method available
 */
export const getProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // Try to use a secure RPC function first
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
    
    // Fall back to direct query
    const { data, error } = await supabase
      .from('project_members')
      .select('id, project_member_name, role, user_id')
      .eq('project_id', projectId)
      .is('left_at', null);
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    return data.map(member => ({
      id: member.id,
      name: member.project_member_name || 'Team Member',
      role: member.role || 'team_member',
      user_id: member.user_id
    }));
  } catch (error) {
    console.error('Error in getProjectTeamMembers:', error);
    return [];
  }
};

/**
 * Adds a new team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string,
  member: { name: string; role: string; user_id: string; email?: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc(
      'add_project_member',
      {
        p_project_id: projectId,
        p_user_id: member.user_id,
        p_name: member.name,
        p_role: member.role,
        p_email: member.email || null
      }
    );
    
    if (error) {
      console.error('Error adding team member:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addProjectTeamMember:', error);
    return false;
  }
};

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (
  projectId: string,
  memberId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc(
      'remove_project_member',
      {
        p_project_id: projectId,
        p_member_id: memberId
      }
    );
    
    if (error) {
      console.error('Error removing team member:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeProjectTeamMember:', error);
    return false;
  }
};
