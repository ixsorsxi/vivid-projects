
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
    
    // First try to get from project_members table
    const { data: manager, error: managerError } = await supabase
      .from('project_members')
      .select('name, role')
      .eq('project_id', projectId)
      .eq('user_id', managerId)
      .single();
    
    if (!managerError && manager && manager.name) {
      console.log('Found manager in project_members:', manager);
      return manager.name;
    }
    
    // Also try to find any team member with the role containing "manager"
    const { data: managerByRole, error: roleError } = await supabase
      .from('project_members')
      .select('name, role')
      .eq('project_id', projectId)
      .ilike('role', '%manager%')
      .single();
    
    if (!roleError && managerByRole && managerByRole.name) {
      console.log('Found manager by role:', managerByRole);
      return managerByRole.name;
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
    
    console.log('Manager not found in any table');
    return 'Not Assigned';
  } catch (error) {
    console.error('Error fetching project manager:', error);
    return 'Not Assigned';
  }
};
