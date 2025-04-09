
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Adds a team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string | number 
  }
): Promise<boolean> => {
  try {
    debugLog('API', 'Adding team member to project:', projectId, 'member:', member);
    
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
    
    // Convert user_id to string if it exists
    const userId = member.user_id ? String(member.user_id) : undefined;
    
    // Set defaults or standardize values
    const memberData = {
      project_id: projectId,
      project_member_name: member.name,
      role: member.role || 'team_member',
      user_id: userId,
      joined_at: new Date().toISOString()
    };
    
    debugLog('API', 'Prepared member data:', memberData);
    
    // Check if this user is already a member of the project
    if (userId) {
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .is('left_at', null)
        .maybeSingle();
      
      if (checkError) {
        debugError('API', 'Error checking existing membership:', checkError);
        throw new Error(`Error checking existing membership: ${checkError.message}`);
      } else if (existingMember) {
        debugError('API', 'User is already a member of this project');
        throw new Error('This user is already a member of this project');
      }
    }
    
    // Log the SQL that would be executed
    debugLog('API', 'Executing SQL: INSERT INTO project_members(project_id, project_member_name, role, user_id, joined_at) VALUES (...)', 
      memberData);
    
    // Use direct insert for better error handling
    const { error } = await supabase
      .from('project_members')
      .insert(memberData);

    if (error) {
      // Try a different approach if RLS is causing issues
      if (error.message?.includes('recursion') || error.message?.includes('violates')) {
        debugLog('API', 'Attempting to use RPC function to bypass RLS');
        
        // Try using an RPC function instead
        const { error: rpcError } = await supabase.rpc('add_project_member', {
          p_project_id: projectId,
          p_user_id: userId,
          p_name: member.name,
          p_role: member.role,
          p_email: member.email || null
        });
        
        if (rpcError) {
          const formattedError = handleDatabaseError(rpcError);
          debugError('API', 'RPC error adding team member:', formattedError);
          throw new Error(`RPC error: ${formattedError}`);
        }
        
        debugLog('API', 'Successfully added team member via RPC function');
        return true;
      }
      
      // Handle regular errors
      const formattedError = handleDatabaseError(error);
      debugError('API', 'Error adding team member:', formattedError);
      throw new Error(`Database error: ${formattedError}`);
    }

    debugLog('API', 'Successfully added team member');
    return true;
  } catch (error) {
    debugError('API', 'Error in addProjectTeamMember:', error);
    
    // Display toast notification for the error
    toast.error('Failed to add team member', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    
    // Re-throw the error so it can be handled by the caller
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error occurred when adding team member');
    }
  }
};

// Legacy function name preserved for backward compatibility
export const addTeamMemberToProject = addProjectTeamMember;
