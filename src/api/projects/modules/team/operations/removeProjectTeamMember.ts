
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    debugLog('API', 'Removing team member from project:', projectId, 'memberId:', memberId);
    
    // Instead of deleting, update the left_at timestamp
    const { error } = await supabase
      .from('project_members')
      .update({ left_at: new Date().toISOString() })
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      debugError('API', 'Error removing team member:', formattedError);
      return false;
    }

    debugLog('API', 'Successfully removed team member');
    return true;
  } catch (error) {
    debugError('API', 'Error in removeProjectTeamMember:', error);
    return false;
  }
};
