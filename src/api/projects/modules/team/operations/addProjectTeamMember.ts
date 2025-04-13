
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Adds a team member to a project
 * Uses RPC function to avoid RLS recursion issues
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { 
    name: string; 
    role: string; 
    user_id: string;
    email?: string;
  }
): Promise<boolean> => {
  try {
    debugLog('TEAM API', 'Adding team member to project:', projectId, 'member:', member);
    
    // Validation
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    if (!member.name) {
      throw new Error('Member name is required');
    }
    
    if (!member.role) {
      throw new Error('Member role is required');
    }
    
    if (!member.user_id) {
      throw new Error('User ID is required');
    }
    
    // Standardize the role format to use underscores
    const standardizedRole = member.role.replace(/-/g, '_');
    
    // Use the newly created safe RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'add_project_member',
      {
        p_project_id: projectId,
        p_user_id: member.user_id,
        p_name: member.name,
        p_role: standardizedRole,
        p_email: member.email || null
      }
    );
    
    if (rpcError) {
      // Specific error for already being a member
      if (rpcError.message && rpcError.message.includes('already a member')) {
        debugError('TEAM API', 'User is already a member of this project:', rpcError);
        throw new Error('This user is already a member of the project');
      }
      
      // Permission errors
      if (rpcError.message && rpcError.message.includes('Permission denied')) {
        debugError('TEAM API', 'Permission denied adding team member:', rpcError);
        throw new Error('Permission denied: You cannot add members to this project');
      }
      
      debugError('TEAM API', 'RPC error adding team member:', rpcError);
      throw new Error(`Failed to add team member: ${rpcError.message}`);
    }
    
    debugLog('TEAM API', 'Successfully added team member');
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    debugError('TEAM API', 'Exception in addProjectTeamMember:', errorMsg);
    
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
};

// Export both the original function name and the new name for backward compatibility
export { addProjectTeamMember as addTeamMemberToProject };
