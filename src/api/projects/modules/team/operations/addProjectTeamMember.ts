
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Adds a team member to a project
 * Uses direct query with strong validation
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
    
    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', member.user_id)
      .is('left_at', null)
      .maybeSingle();
      
    if (checkError) {
      debugError('TEAM API', 'Error checking existing membership:', checkError);
    }
    
    if (existingMember) {
      debugLog('TEAM API', 'User is already a member of this project');
      throw new Error('This user is already a member of the project');
    }

    // Standardize the role format to use underscores
    const standardizedRole = member.role.replace(/-/g, '_');
    
    // Attempt direct insert first
    const { error: insertError } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: member.user_id,
        project_member_name: member.name,
        role: standardizedRole,
        joined_at: new Date().toISOString()
      });
    
    if (insertError) {
      debugError('TEAM API', 'Error in direct insert:', insertError);
      
      // Try alternative approach if allowed - using the RPC function if it exists
      try {
        const { error: rpcError } = await supabase.rpc(
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
          debugError('TEAM API', 'RPC error adding team member:', rpcError);
          throw new Error(`Failed to add team member: ${rpcError.message}`);
        }
        
        debugLog('TEAM API', 'Successfully added team member via RPC function');
        return true;
      } catch (rpcError) {
        debugError('TEAM API', 'Exception in RPC add member fallback:', rpcError);
        throw rpcError;
      }
    }
    
    debugLog('TEAM API', 'Successfully added team member via direct insert');
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
