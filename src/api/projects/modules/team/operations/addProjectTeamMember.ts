
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Adds a team member to a project
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
    
    // Format the role to ensure it's in the standardized format (using underscores)
    const formattedRole = member.role.toLowerCase().replace(/[\s-]/g, '_');
    
    // Call the Supabase function to add the member
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: member.user_id,
        project_member_name: member.name,
        role: formattedRole
      })
      .select()
      .single();
    
    if (error) {
      // Check for specific error cases
      if (error.message.includes('duplicate key')) {
        debugError('TEAM API', 'User is already a member of this project:', error);
        throw new Error('This user is already a member of the project');
      }
      
      if (error.message.includes('violates row level security policy')) {
        debugError('TEAM API', 'Permission denied adding team member:', error);
        throw new Error('Permission denied: You cannot add members to this project');
      }
      
      debugError('TEAM API', 'Error adding team member:', error);
      throw new Error(`Failed to add team member: ${error.message}`);
    }
    
    debugLog('TEAM API', 'Successfully added team member:', data);
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
