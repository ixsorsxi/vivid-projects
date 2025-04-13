
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '../types';
import { ProjectRoleKey } from '../permissions';

/**
 * Updates an existing team member
 * Uses the direct role column in project_members
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
    
    if (data.role) {
      // With our bidirectional sync in place, just update the role column
      // and the trigger will handle updating user_project_roles
      updateData.role = data.role;
    }
    
    // Only proceed if we have data to update
    if (Object.keys(updateData).length === 0) {
      return true;
    }
    
    const { error } = await supabase
      .from('project_members')
      .update(updateData)
      .eq('id', memberId);
    
    if (error) {
      console.error('Error updating team member:', error);
      return false;
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
