
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
  
  // Look for the project manager in the team members list
  const manager = teamMembers.find(member => 
    member.id.toString() === managerId.toString() || 
    (member.user_id && member.user_id.toString() === managerId.toString())
  );
  
  return manager ? manager.name : 'Not Assigned';
};

/**
 * Attempts to find a project manager by querying the database directly
 */
export const fetchProjectManagerName = async (projectId: string, managerId: string): Promise<string> => {
  try {
    // First try to get from project_members table
    const { data: manager, error: managerError } = await supabase
      .from('project_members')
      .select('name')
      .eq('project_id', projectId)
      .eq('user_id', managerId)
      .single();
    
    if (!managerError && manager && manager.name) {
      return manager.name;
    }
    
    // If not found in project_members, try to get from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', managerId)
      .single();
      
    if (!profileError && profile && profile.full_name) {
      return profile.full_name;
    }
    
    return 'Not Assigned';
  } catch (error) {
    console.error('Error fetching project manager:', error);
    return 'Not Assigned';
  }
};
