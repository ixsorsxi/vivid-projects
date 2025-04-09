
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';
import { checkUserProjectAccess } from '@/utils/projectAccessChecker';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Adds a team member to a project by directly inserting into the project_members table
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { name: string; role: string; email?: string; user_id?: string }
): Promise<boolean> => {
  try {
    debugLog('API', 'Adding team member to project:', projectId);
    debugLog('API', 'Member data:', member);
    
    // First check if the current user has access to add members to this project
    const accessCheck = await checkUserProjectAccess(projectId);
    if (!accessCheck.hasAccess) {
      const errorMsg = `Permission denied: ${accessCheck.reason || 'You cannot add members to this project'}`;
      debugError('API', errorMsg);
      throw new Error(errorMsg);
    }
    
    // Create a safer member object with default values
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null, // This may be null for email invites
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'team_member',
      joined_at: new Date().toISOString()
    };
    
    debugLog('API', 'Processed member data for insert:', memberData);
    
    // First check if this user is already a member of the project
    if (memberData.user_id) {
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', memberData.user_id)
        .maybeSingle();
      
      if (checkError) {
        debugError('API', 'Error checking for existing membership:', checkError);
      } else if (existingMember) {
        debugError('API', 'User is already a member of this project');
        throw new Error('This user is already a member of this project');
      }
    }
    
    // Try using the RPC function to bypass RLS issues
    try {
      // First check if we have direct access to this project
      const { data: hasAccess, error: accessError } = await supabase.rpc(
        'direct_project_access',
        { p_project_id: projectId }
      );
      
      if (accessError) {
        debugError('API', 'Error checking direct project access:', accessError);
      } else if (hasAccess) {
        debugLog('API', 'User has direct access to project, attempting to add member via RPC');
        
        // Try using add_project_member RPC function
        const { data: newMemberId, error: rpcError } = await supabase.rpc(
          'add_project_member', 
          { 
            p_project_id: projectId,
            p_user_id: memberData.user_id,
            p_name: memberData.project_member_name,
            p_role: memberData.role,
            p_email: member.email
          }
        );
        
        if (rpcError) {
          debugError('API', 'Error adding member via RPC:', rpcError);
        } else if (newMemberId) {
          debugLog('API', 'Successfully added member via RPC with ID:', newMemberId);
          return true;
        }
      }
    } catch (rpcError) {
      debugError('API', 'Exception in RPC attempt:', rpcError);
      // Continue with standard approach if RPC fails
    }
    
    // Use direct insert with single() to get feedback
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select()
      .single();
    
    if (error) {
      // Handle specific error types
      if (error.code === '23505') { // Unique violation
        debugError('API', 'User is already a member of this project');
        throw new Error('This user is already a member of this project');
      } else if (error.code === '42501') { // Permission denied
        debugError('API', 'Permission denied when adding team member');
        throw new Error('You don\'t have permission to add members to this project');
      } else {
        debugError('API', 'Error adding team member:', error);
        throw new Error(error.message || 'Failed to add team member');
      }
    }
    
    debugLog('API', 'Successfully added team member with ID:', data?.id);
    return true;
  } catch (error) {
    debugError('API', 'Exception in addProjectTeamMember:', error);
    toast.error('Failed to add team member', {
      description: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
    throw error; // Re-throw for UI handling
  }
};

/**
 * Wrapper function for adding a team member to a project
 */
export const addTeamMemberToProject = async (
  projectId: string,
  userId: string | undefined,
  name: string,
  role: string = 'team_member',
  email?: string
): Promise<boolean> => {
  debugLog('API', 'addTeamMemberToProject called with:', { projectId, userId, name, role, email });
  
  try {
    return await addProjectTeamMember(projectId, {
      user_id: userId,
      name: name,
      role: role,
      email: email
    });
  } catch (error) {
    debugError('API', 'Error in addTeamMemberToProject:', error);
    throw error;
  }
};
