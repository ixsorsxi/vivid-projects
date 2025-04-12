
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';
import { ProjectRoleKey, assignProjectRole } from '../permissions';

/**
 * Updates an existing team member
 */
export const updateProjectTeamMember = async (
  memberId: string,
  data: {
    name?: string;
    role?: ProjectRoleKey | string;
    // Add any other fields that can be updated
  }
): Promise<boolean> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    
    if (data.name) {
      updateData.project_member_name = data.name;
    }
    
    // First, check if we have data to update in the project_members table
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('project_members')
        .update(updateData)
        .eq('id', memberId);
      
      if (error) {
        console.error('Error updating team member:', error);
        return false;
      }
    }
    
    // If role is provided, we need to update the user_project_roles table
    if (data.role) {
      // First, get user_id and project_id for this member
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('user_id, project_id')
        .eq('id', memberId)
        .single();
      
      if (memberError || !memberData?.user_id || !memberData?.project_id) {
        console.error('Error fetching team member details:', memberError);
        return false;
      }
      
      // Now update the user's role
      const roleUpdated = await assignProjectRole(
        memberData.user_id,
        memberData.project_id,
        data.role
      );
      
      if (!roleUpdated) {
        console.error('Error updating team member role');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateProjectTeamMember:', error);
    return false;
  }
};

/**
 * Alias for updateProjectTeamMember (for backward compatibility)
 */
export const addTeamMemberToProject = updateProjectTeamMember;
