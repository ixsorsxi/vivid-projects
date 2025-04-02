
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/lib/types/common';

/**
 * Fetches team members for a specific project
 */
export const fetchProjectTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching team members');
      return [];
    }

    console.log('Fetching team members for project:', projectId);
    
    // Try to fetch from project_members table
    try {
      const { data: teamMembers, error: teamError } = await supabase
        .from('project_members')
        .select('id, user_id, name, role')
        .eq('project_id', projectId);
      
      if (teamError) {
        throw teamError;
      }

      console.log('Raw team members from database:', teamMembers);

      // Transform to TeamMember type
      return (teamMembers || []).map(t => ({ 
        id: t.id, 
        name: t.name || 'Unnamed', 
        role: t.role || 'Member',
        user_id: t.user_id
      }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      console.log('Fetching team members directly from the RPC function instead');
      
      // As a fallback, try to get team members from the project RPC function
      const { data: projectData, error: projectError } = await supabase
        .rpc('get_project_by_id', { p_project_id: projectId });
      
      if (projectError || !projectData || projectData.length === 0) {
        console.error('Error fetching project by ID:', projectError);
        return [];
      }
      
      const project = projectData[0];
      console.log('Fetched team members directly:', project.team);
      
      // If there's team data in the project, use it
      if (project.team && Array.isArray(project.team)) {
        // Properly type and access each team member object
        return project.team.map((member: any) => ({
          id: member.id || String(Date.now()),
          name: member.name || 'Team Member',
          role: member.role || 'Member',
          user_id: member.user_id
        }));
      }
      
      return [];
    }
  } catch (error) {
    console.error('Error in fetchProjectTeamMembers:', error);
    return [];
  }
};

/**
 * Find a project manager in a list of team members
 */
export const findProjectManager = (teamMembers: TeamMember[], managerId: string | null): string => {
  if (!managerId) return 'Not Assigned';
  
  console.log('Looking for project manager with ID:', managerId, 'in team members:', teamMembers);
  
  // Look for the project manager in the team members list by user_id or id
  const manager = teamMembers.find(member => {
    // Try matching by direct ID
    if (member.id && member.id.toString() === managerId.toString()) {
      return true;
    }
    
    // Try matching by user_id
    if (member.user_id && member.user_id.toString() === managerId.toString()) {
      return true;
    }
    
    return false;
  });
  
  console.log('Found manager:', manager);
  return manager ? manager.name : 'Not Assigned';
};

/**
 * Attempts to find a project manager by querying the database directly
 */
export const fetchProjectManagerName = async (projectId: string, managerId: string): Promise<string> => {
  try {
    console.log('Fetching project manager name for project:', projectId, 'managerId:', managerId);
    
    // If we have a manager ID, try to find them directly first
    if (managerId) {
      // Try to find by project_manager_id in project_members
      const { data: managerById, error: idError } = await supabase
        .from('project_members')
        .select('name')
        .eq('project_id', projectId)
        .eq('user_id', managerId)
        .single();
      
      if (!idError && managerById && managerById.name) {
        console.log('Found manager by ID in project_members:', managerById);
        return managerById.name;
      }
      
      // Try to find by direct ID in project_members
      const { data: managerByDirectId, error: directIdError } = await supabase
        .from('project_members')
        .select('name')
        .eq('project_id', projectId)
        .eq('id', managerId)
        .single();
      
      if (!directIdError && managerByDirectId && managerByDirectId.name) {
        console.log('Found manager by direct ID in project_members:', managerByDirectId);
        return managerByDirectId.name;
      }
      
      // If not found in project_members, try to get from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', managerId)
        .single();
        
      if (!profileError && profile && profile.full_name) {
        console.log('Found manager in profiles:', profile);
        return profile.full_name;
      }
    }
    
    // Fallback: check for any team member with manager role
    const { data: managerByRole, error: roleError } = await supabase
      .from('project_members')
      .select('name, role')
      .eq('project_id', projectId)
      .ilike('role', '%manager%')
      .single();
    
    if (!roleError && managerByRole && managerByRole.name) {
      console.log('Found manager by role in project_members:', managerByRole);
      return managerByRole.name;
    }
    
    // If no explicit manager exists, use the first team member 
    // from the project_members table as the manager
    const { data: anyMember, error: anyMemberError } = await supabase
      .from('project_members')
      .select('name')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (!anyMemberError && anyMember && anyMember.name) {
      console.log('Using first team member as manager:', anyMember);
      return anyMember.name;
    }
    
    console.log('Manager not found in any table');
    return 'Not Assigned';
  } catch (error) {
    console.error('Error fetching project manager:', error);
    return 'Not Assigned';
  }
};

/**
 * Adds a team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { name: string; role: string; email?: string; user_id?: string }
): Promise<boolean> => {
  try {
    console.log('Adding team member to project:', projectId, member);
    
    // Ensure we're passing valid values
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'Member'
    };
    
    console.log('Member data to insert:', memberData);
    
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select('id, name, role')
      .single();

    if (error) {
      console.error('Error adding team member:', error);
      return false;
    }

    console.log('Successfully added team member:', data);
    return true;
  } catch (error) {
    console.error('Error in addProjectTeamMember:', error);
    return false;
  }
};

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    console.log('Removing team member from project:', projectId, memberId);
    
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('id', memberId);

    if (error) {
      console.error('Error removing team member:', error);
      return false;
    }

    console.log('Successfully removed team member');
    return true;
  } catch (error) {
    console.error('Error in removeProjectTeamMember:', error);
    return false;
  }
};
