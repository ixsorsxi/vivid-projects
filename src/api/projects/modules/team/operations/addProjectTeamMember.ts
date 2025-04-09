
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Adds a team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }
): Promise<boolean> => {
  try {
    debugLog('API', 'Adding team member to project:', projectId, 'member:', member);
    
    // Set defaults or standardize values
    const memberData = {
      project_id: projectId,
      project_member_name: member.name,
      role: member.role || 'team_member',
      user_id: member.user_id,
      joined_at: new Date().toISOString()
    };
    
    debugLog('API', 'Prepared member data:', memberData);
    
    // Check if this user is already a member of the project
    if (member.user_id) {
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', member.user_id)
        .is('left_at', null)
        .maybeSingle();
      
      if (checkError) {
        debugError('API', 'Error checking existing membership:', checkError);
      } else if (existingMember) {
        debugError('API', 'User is already a member of this project');
        return false;
      }
    }
    
    // Use direct insert for better error handling
    const { error } = await supabase
      .from('project_members')
      .insert(memberData);

    if (error) {
      const formattedError = handleDatabaseError(error);
      debugError('API', 'Error adding team member:', formattedError);
      return false;
    }

    debugLog('API', 'Successfully added team member');
    return true;
  } catch (error) {
    debugError('API', 'Error in addProjectTeamMember:', error);
    return false;
  }
};

// Legacy function name preserved for backward compatibility
export const addTeamMemberToProject = addProjectTeamMember;
