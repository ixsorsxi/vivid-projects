
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Adds a team member to a project using a direct SQL approach
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
    
    // First, check if the current user has permission to add members
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();
      
    if (projectError) {
      debugError('API', 'Error fetching project data:', projectError);
      return false;
    }
    
    // Only project owner or admins can add members
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();
      
    const isAdmin = profileData?.role === 'admin';
    const isProjectOwner = projectData?.user_id === currentUser.id;
    
    if (!isAdmin && !isProjectOwner) {
      debugError('API', 'Permission denied: User is not project owner or admin');
      return false;
    }
    
    // Check if user is already a member
    if (member.user_id) {
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', member.user_id)
        .maybeSingle();
        
      if (existingMember) {
        debugError('API', 'User is already a member of this project');
        throw new Error('This user is already a member of this project');
      }
    }
    
    // Insert the new team member directly
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: member.user_id,
        project_member_name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
        role: member.role || 'team_member',
        joined_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      debugError('API', 'Error inserting project member:', error);
      throw new Error(error.message);
    }
    
    debugLog('API', 'Successfully added team member with ID:', data.id);
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
