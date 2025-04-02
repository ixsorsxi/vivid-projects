
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/projects/team/types';

export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);
    
    // Try using the RPC function which returns the project with team data
    const { data: projectData, error: rpcError } = await supabase
      .rpc('get_project_by_id', { p_project_id: projectId });
    
    if (rpcError) {
      console.error('RPC error fetching team:', rpcError);
      throw rpcError;
    }
    
    if (projectData) {
      // The project should include a 'team' array
      const project = Array.isArray(projectData) ? projectData[0] : projectData;
      
      if (project && project.team && Array.isArray(project.team)) {
        console.log('Retrieved team data from RPC:', project.team);
        
        return project.team.map((member: any) => ({
          id: member.id || String(Date.now()),
          name: member.name || 'Team Member',
          role: member.role || 'Member',
          user_id: member.user_id
        }));
      }
    }
    
    // Fallback to direct query if RPC doesn't return team data
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, name, role')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
    
    console.log('Retrieved team members via direct query:', data);
    
    return (data || []).map(member => ({
      id: member.id,
      name: member.name || 'Team Member',
      role: member.role || 'Member',
      user_id: member.user_id
    }));
  } catch (error) {
    console.error('Error in fetchProjectTeamMembers:', error);
    return [];
  }
};

export const addProjectTeamMember = async (
  projectId: string, 
  member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }
): Promise<boolean> => {
  try {
    console.log('Adding team member to project with data:', { projectId, member });
    
    // For debugging purposes, log the member data structure
    console.log('Member data structure:', JSON.stringify(member, null, 2));
    
    // Get current user id from auth state to provide to the function
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Use the RPC function to add team members with proper security context
    const { data, error } = await supabase.rpc(
      'add_project_members',
      {
        p_project_id: projectId,
        p_user_id: userId,
        p_team_members: JSON.stringify([{
          name: member.name,
          role: member.role,
          user_id: member.user_id || null
        }])
      }
    );
    
    if (error) {
      console.error('Error adding team member via RPC:', error);
      // Detailed error information
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
      return false;
    }
    
    console.log('Successfully added team member via RPC:', data);
    return true;
  } catch (error) {
    console.error('Exception in addProjectTeamMember:', error);
    return false;
  }
};

export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    console.log('Removing team member from project:', { projectId, memberId });
    
    // Use the built-in RPC function for removing team members
    const { data, error } = await supabase.rpc(
      'remove_project_member',
      {
        p_project_id: projectId,
        p_member_id: memberId
      }
    );
    
    if (error) {
      console.error('Error removing team member via RPC:', error);
      return false;
    }
    
    // Fallback to direct deletion if RPC function not available
    if (data === undefined) {
      console.log('RPC function not found, using direct delete');
      
      // Use direct delete with the project member ID
      const { error: deleteError } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId)
        .eq('project_id', projectId);
      
      if (deleteError) {
        console.error('Error in direct removal of team member:', deleteError);
        return false;
      }
    }
    
    console.log('Successfully removed team member');
    return true;
  } catch (error) {
    console.error('Exception in removeProjectTeamMember:', error);
    return false;
  }
};
