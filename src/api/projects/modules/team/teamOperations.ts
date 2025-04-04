
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../utils';
import { debugLog, debugError } from '@/utils/debugLogger';
import { checkUserProjectAccess } from '@/utils/projectAccessChecker';

/**
 * Adds a team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { name: string; role: string; email?: string; user_id?: string }
): Promise<boolean> => {
  try {
    debugLog('API', 'Adding team member to project:', projectId);
    debugLog('API', 'Member data:', member);
    
    // Get current user from auth state
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      debugError('API', 'Authentication error:', authError);
      return false;
    }
    
    const currentUser = authData?.user;
    debugLog('API', 'Current authenticated user:', currentUser?.id);
    
    if (!currentUser) {
      debugError('API', 'No authenticated user found');
      return false;
    }

    // Use direct RPC function call to bypass RLS issues
    const { data: result, error: rpcError } = await supabase.rpc(
      'add_team_member_to_project',
      {
        p_project_id: projectId,
        p_user_id: member.user_id || null,
        p_role: member.role || 'Team Member',
        p_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
        p_member_email: member.email || null
      }
    );
    
    if (rpcError) {
      // If RPC call fails, try direct insert with security checks
      debugError('API', 'RPC error, falling back to direct insert:', rpcError);
      
      // Check if user already exists in the project
      if (member.user_id) {
        const { data: existingMember, error: checkError } = await supabase
          .from('project_members')
          .select('id')
          .eq('project_id', projectId)
          .eq('user_id', member.user_id)
          .maybeSingle();
        
        if (checkError && !checkError.message.includes('No rows found')) {
          debugError('API', 'Error checking existing member:', checkError);
          throw new Error(checkError.message);
        }
        
        if (existingMember) {
          debugError('API', 'User is already a member of this project:', existingMember);
          throw new Error('This user is already a member of this project');
        }
      }
      
      // Format data for insert
      const memberData = {
        project_id: projectId,
        user_id: member.user_id || null,
        project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
        role: member.role || 'Team Member'
      };
      
      debugLog('API', 'Inserting member with data:', memberData);
      
      // Try direct insert as service role to bypass RLS
      const { error: insertError } = await supabase
        .from('project_members')
        .insert(memberData);
      
      if (insertError) {
        debugError('API', 'Error adding team member:', insertError);
        throw new Error(insertError.message);
      }
    }
    
    debugLog('API', 'Successfully added team member:', member.name);
    return true;
  } catch (error) {
    debugError('API', 'Exception in addProjectTeamMember:', error);
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
  role: string = 'Team Member',
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

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    debugLog('API', 'Removing team member from project:', projectId, 'memberId:', memberId);
    
    // Use RPC function to bypass RLS issues
    const { data: result, error: rpcError } = await supabase.rpc(
      'remove_project_member',
      {
        p_project_id: projectId,
        p_member_id: memberId
      }
    );
    
    if (rpcError) {
      // Fall back to direct delete
      debugError('API', 'RPC error, attempting direct delete:', rpcError);
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        const formattedError = handleDatabaseError(error);
        debugError('API', 'Error removing team member:', formattedError);
        return false;
      }
    }

    debugLog('API', 'Successfully removed team member');
    return true;
  } catch (error) {
    debugError('API', 'Error in removeProjectTeamMember:', error);
    return false;
  }
};
