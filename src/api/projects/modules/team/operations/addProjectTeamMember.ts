
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { toast } from '@/components/ui/toast-wrapper';

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
    
    // Prepare member data
    const memberData = {
      project_id: projectId,
      project_member_name: member.name,
      role: member.role,
      user_id: member.user_id,
      joined_at: new Date().toISOString()
    };
    
    console.log('Prepared member data:', memberData);
    
    // Check if this user is already a member of the project
    const { data: existingMember, error: checkError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', member.user_id)
      .is('left_at', null)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing membership:', checkError);
      throw new Error(`Error checking existing membership: ${checkError.message}`);
    } else if (existingMember) {
      console.error('User is already a member of this project');
      throw new Error('This user is already a member of this project');
    }
    
    // Use direct insert
    const { error } = await supabase
      .from('project_members')
      .insert(memberData);

    if (error) {
      // Try a different approach if insert fails
      console.log('Attempting to use RPC function to bypass potential issues');
      
      // Try using an RPC function instead
      const { error: rpcError } = await supabase.rpc('add_project_member', {
        p_project_id: projectId,
        p_user_id: member.user_id,
        p_name: member.name,
        p_role: member.role,
        p_email: member.email || null
      });
      
      if (rpcError) {
        const formattedError = handleDatabaseError(rpcError);
        console.error('RPC error adding team member:', formattedError);
        throw new Error(`RPC error: ${formattedError}`);
      }
      
      console.log('Successfully added team member via RPC function');
      return true;
    }

    console.log('Successfully added team member via direct insert');
    return true;
  } catch (error) {
    console.error('Error in addProjectTeamMember:', error);
    
    // Display toast notification for the error
    toast.error('Failed to add team member', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
};

// Export both the original function name and the new name for backward compatibility
export { addProjectTeamMember as addTeamMemberToProject };
