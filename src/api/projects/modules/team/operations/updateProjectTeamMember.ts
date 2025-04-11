
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';
import { assignProjectRole } from '../rolePermissions';
import { ProjectRoleKey } from '../types';

/**
 * Updates a team member's role in a project
 */
export const updateProjectTeamMemberRole = async (
  memberId: string, 
  roleId: string
): Promise<boolean> => {
  try {
    debugLog('API', 'Updating team member role:', memberId, 'roleId:', roleId);
    
    // Get the role_key from the project_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('project_roles')
      .select('role_key')
      .eq('id', roleId)
      .single();
      
    if (roleError) {
      debugError('API', 'Error getting role key:', roleError);
      return false;
    }

    // Get the user_id for this member
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('user_id, project_id')
      .eq('id', memberId)
      .single();

    if (memberError || !memberData || !memberData.user_id) {
      debugError('API', 'Error getting member data:', memberError);
      return false;
    }
    
    // Use the assignProjectRole function to update the role in user_project_roles
    // Cast the role_key to ProjectRoleKey to match the type signature
    const success = await assignProjectRole(
      memberData.user_id,
      memberData.project_id,
      roleData.role_key as ProjectRoleKey
    );

    if (!success) {
      debugError('API', 'Error updating user project role');
      return false;
    }

    debugLog('API', 'Successfully updated team member role');
    return true;
  } catch (error) {
    debugError('API', 'Error in updateProjectTeamMemberRole:', error);
    return false;
  }
};
