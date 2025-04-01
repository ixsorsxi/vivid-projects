
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

    const { data: teamMembers, error: teamError } = await supabase
      .from('project_members')
      .select('id, user_id, name, role')
      .eq('project_id', projectId);
    
    if (teamError) {
      console.error('Error fetching team members:', teamError);
      return [];
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
    console.error('Error in fetchProjectTeamMembers:', error);
    return [];
  }
};

/**
 * Find a project manager in a list of team members
 */
export const findProjectManager = (teamMembers: TeamMember[], managerId: string | null): string => {
  if (!managerId || !teamMembers.length) return 'Not Assigned';
  
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
    
    // Check role for "project manager" (case insensitive)
    if (member.role && member.role.toLowerCase().includes('manager')) {
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
    
    // First check for any team member with role containing "manager" regardless of user_id
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
    
    // If no manager by role, try to find by managerId
    if (managerId) {
      const { data: manager, error: managerError } = await supabase
        .from('project_members')
        .select('name, role')
        .eq('project_id', projectId)
        .eq('user_id', managerId)
        .single();
      
      if (!managerError && manager && manager.name) {
        console.log('Found manager by user_id in project_members:', manager);
        return manager.name;
      }
    }
    
    // If still not found, get any project member as a fallback
    const { data: anyMember, error: anyMemberError } = await supabase
      .from('project_members')
      .select('name, role')
      .eq('project_id', projectId)
      .limit(1)
      .single();
    
    if (!anyMemberError && anyMember && anyMember.name) {
      console.log('Using first team member as manager:', anyMember);
      return anyMember.name;
    }
    
    // Last resort - try to get from profiles table if we have a managerId
    if (managerId) {
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
    
    console.log('Manager not found in any table');
    return 'Not Assigned';
  } catch (error) {
    console.error('Error fetching project manager:', error);
    return 'Not Assigned';
  }
};
