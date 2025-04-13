
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
    
    // Primary approach: Use the RPC function
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
      
      // Fallback to direct insert if RPC fails for other reasons
      debugError('TEAM API', 'RPC error adding team member, trying direct insert:', rpcError);
      
      // First check if user is already a member
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
      
      // Attempt direct insert
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
        debugError('TEAM API', 'Direct insert also failed:', insertError);
        
        if (insertError.message && insertError.message.includes('violates row-level security')) {
          throw new Error('Permission denied: You cannot add members to this project');
        }
        
        throw new Error(`Failed to add team member: ${insertError.message}`);
      }
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
