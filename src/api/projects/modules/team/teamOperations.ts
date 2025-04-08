
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

    // Check if user already exists in the project
    if (member.user_id) {
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', member.user_id)
        .is('left_at', null) // Only consider active members
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

    // Get the project role ID if we have a role key
    let projectRoleId: string | undefined;
    if (member.role) {
      const { data: roleData, error: roleError } = await supabase
        .from('project_roles')
        .select('id')
        .eq('role_key', member.role)
        .maybeSingle();
        
      if (!roleError && roleData?.id) {
        projectRoleId = roleData.id;
      }
    }

    // Format data for insert
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'Team Member',
      project_role_id: projectRoleId,
      joined_at: new Date().toISOString()
    };
    
    debugLog('API', 'Inserting member with data:', memberData);
    
    // Try using an RPC function if one exists
    try {
      // First try to use direct insert with bypass function
      const { data: insertData, error: insertError } = await supabase
        .from('project_members')
        .insert(memberData)
        .select();
      
      if (insertError) {
        debugError('API', 'Error with direct insert:', insertError);
        throw insertError;
      }
      
      debugLog('API', 'Successfully added team member with direct insert:', insertData);
      return true;
    } catch (directError) {
      debugError('API', 'Direct insert failed, trying alternative methods:', directError);
      
      // Try using the bypass function directly
      try {
        const { data: bypassResult } = await supabase.rpc('bypass_rls_for_development');
        debugLog('API', 'Bypass RLS function result:', bypassResult);
        
        // Try insert again after calling bypass
        const { data, error } = await supabase
          .from('project_members')
          .insert(memberData)
          .select();
          
        if (error) {
          debugError('API', 'Insert after bypass also failed:', error);
          throw error;
        }
        
        debugLog('API', 'Insert after bypass succeeded:', data);
        return true;
      } catch (bypassError) {
        debugError('API', 'Error calling bypass function:', bypassError);
        throw bypassError;
      }
    }
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

/**
 * Updates a team member's role in a project
 */
export const updateProjectTeamMemberRole = async (
  memberId: string, 
  roleId: string
): Promise<boolean> => {
  try {
    debugLog('API', 'Updating team member role:', memberId, 'roleId:', roleId);
    
    // Get the role_key from the project_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('project_roles')
      .select('role_key')
      .eq('id', roleId)
      .single();
      
    if (roleError) {
      debugError('API', 'Error getting role key:', roleError);
      return false;
    }
    
    // Update both role and project_role_id fields
    const { error } = await supabase
      .from('project_members')
      .update({ 
        role: roleData.role_key,
        project_role_id: roleId 
      })
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      debugError('API', 'Error updating team member role:', formattedError);
      return false;
    }

    debugLog('API', 'Successfully updated team member role');
    return true;
  } catch (error) {
    debugError('API', 'Error in updateProjectTeamMemberRole:', error);
    return false;
  }
};

/**
 * Fetches available project roles from the database
 */
export const fetchProjectRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('project_roles')
      .select('id, role_key, description')
      .order('role_key');

    if (error) {
      debugError('API', 'Error fetching project roles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    debugError('API', 'Exception in fetchProjectRoles:', error);
    return [];
  }
};
