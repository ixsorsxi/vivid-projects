
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Adds a team member to a project
 * Uses multiple strategies to handle potential RLS issues
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
    console.log('Adding team member to project:', projectId, 'member:', member);
    
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
    
    // Use the RPC function which is designed to bypass RLS issues
    const { data: rpcResult, error: rpcError } = await supabase.rpc('add_project_member', {
      p_project_id: projectId,
      p_user_id: member.user_id,
      p_name: member.name,
      p_role: standardizedRole,
      p_email: member.email || null
    });
    
    if (rpcError) {
      const formattedError = handleDatabaseError(rpcError);
      console.error('RPC error adding team member:', formattedError);
      
      // If it's an already-member error, provide a clearer message
      if (rpcError.message.includes('already a member')) {
        throw new Error('This user is already a member of the project');
      }
      
      throw new Error(`Failed to add team member: ${formattedError}`);
    }
    
    console.log('Successfully added team member via RPC function');
    return true;
  } catch (error) {
    console.error('Error in addProjectTeamMember:', error);
    
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
};

// Export both the original function name and the new name for backward compatibility
export { addProjectTeamMember as addTeamMemberToProject };
