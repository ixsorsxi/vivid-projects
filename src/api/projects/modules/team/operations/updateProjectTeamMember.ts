
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';

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
    
    // Update both role and project_role_id fields
    const { error } = await supabase
      .from('project_members')
      .update({ 
        role: roleData.role_key,
        project_role_id: roleId 
      })
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      debugError('API', 'Error updating team member role:', formattedError);
      return false;
    }

    debugLog('API', 'Successfully updated team member role');
    return true;
  } catch (error) {
    debugError('API', 'Error in updateProjectTeamMemberRole:', error);
    return false;
  }
};
