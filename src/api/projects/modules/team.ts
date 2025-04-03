
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/projects/team/types';

export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    console.log('Fetching team members for project:', projectId);
    
    // Get current user for context
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    if (!currentUser) {
      console.error('No authenticated user found when fetching team members');
      return [];
    }
    
    // Direct query approach - most reliable
    const { data, error } = await supabase
      .from('project_members')
      .select('id, user_id, project_member_name, role')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    
    console.log('Retrieved team members:', data);
    
    // Make sure to properly format the member data with correct names
    return (data || []).map(member => ({
      id: member.id,
      // Explicitly use the name from the database, not the role
      name: member.project_member_name || 'Team Member',
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
    
    // Get current user id from auth state
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    if (!currentUser) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Prepare member data for insert
    const memberData = {
      project_id: projectId,
      project_member_name: member.name || 'Team Member',
      role: member.role || 'Member',
      user_id: member.user_id || null
    };
    
    console.log('Member data to insert:', memberData);
    
    // Try direct insert first (with RLS this will work for project owners and admins)
    try {
      const { error } = await supabase
        .from('project_members')
        .insert(memberData);
      
      if (error) {
        console.error('Error in direct insert:', error);
        // Fall through to RPC method
      } else {
        console.log('Successfully added team member via direct insert');
        return true;
      }
    } catch (insertError) {
      console.error('Exception in direct insert:', insertError);
      // Fall through to RPC method
    }
    
    // Try RPC method as fallback
    try {
      console.log('Attempting to add member via RPC function');
      
      const { error: rpcError } = await supabase.rpc('add_project_members', {
        p_project_id: projectId,
        p_user_id: currentUser.id,
        p_team_members: JSON.stringify([{
          name: member.name,
          role: member.role,
          user_id: member.user_id || null
        }])
      });
      
      if (rpcError) {
        console.error('Error in RPC fallback:', rpcError);
        return false;
      }
      
      console.log('Successfully added team member via RPC function');
      return true;
    } catch (rpcErr) {
      console.error('Exception in RPC fallback:', rpcErr);
      return false;
    }
  } catch (error) {
    console.error('Exception in addProjectTeamMember:', error);
    return false;
  }
};

export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    console.log('Removing team member from project:', { projectId, memberId });
    
    // Get current user for context
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    
    if (!currentUser) {
      console.error('No authenticated user found');
      return false;
    }
    
    // First attempt: Try direct deletion
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId)
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Error in direct deletion:', error);
        // Fall through to RPC method
      } else {
        console.log('Successfully removed team member via direct deletion');
        return true;
      }
    } catch (deleteError) {
      console.error('Exception in direct deletion:', deleteError);
      // Fall through to RPC method
    }
    
    // Second attempt: Try the secure RPC function
    try {
      console.log('Using remove_project_member RPC function');
      const { error: rpcError } = await supabase.rpc(
        'remove_project_member', 
        { 
          p_project_id: projectId, 
          p_member_id: memberId 
        }
      );
      
      if (rpcError) {
        console.error('Error using remove_project_member RPC:', rpcError);
        return false;
      }
      
      console.log('Successfully removed team member via RPC function');
      return true;
    } catch (rpcErr) {
      console.error('Error in RPC approach:', rpcErr);
      return false;
    }
  } catch (error) {
    console.error('Error in removeProjectTeamMember:', error);
    return false;
  }
};

// Fix to remove duplicate exports by importing and re-exporting the specific functions we need
export * from './team/teamOperations';
export * from './team/types';

// Import and re-export the necessary functions from fetchTeamMembers,
// but explicitly excluding fetchProjectTeamMembers which we've defined here
// and fetchProjectManagerName which we'll import separately
import { fetchTeamManagerName } from './team/fetchTeamMembers';
export { fetchTeamManagerName };

// Export the projectManager functions but not the fetchProjectManagerName
export { findProjectManager } from './team/projectManager';
