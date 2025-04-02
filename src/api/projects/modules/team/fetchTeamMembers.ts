
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
    
    // Try to fetch from project_members table directly - most reliable method
    try {
      const { data: teamMembers, error: teamError } = await supabase
        .from('project_members')
        .select('id, user_id, name, role')
        .eq('project_id', projectId);
      
      if (teamError) {
        console.error('Error fetching team members:', teamError);
        throw teamError;
      }

      console.log('Raw team members from database:', teamMembers);

      if (teamMembers && teamMembers.length > 0) {
        // Transform to TeamMember type with proper defaults
        return teamMembers.map(t => ({ 
          id: t.id, 
          name: t.name || 'Unnamed', // Use name field if available
          role: t.role || 'Member',
          user_id: t.user_id
        }));
      } else {
        console.log('No team members found in direct query, trying RPC function');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      console.log('Fetching team members from RPC function instead');
    }
    
    // As a fallback, try to get team members from the project RPC function
    const { data: projectData, error: projectError } = await supabase
      .rpc('get_project_by_id', { p_project_id: projectId });
    
    if (projectError || !projectData) {
      console.error('Error fetching project by ID:', projectError);
      return [];
    }
    
    const project = Array.isArray(projectData) ? projectData[0] : projectData;
    
    if (!project || !project.team) {
      console.warn('No team data found in project');
      return [];
    }
    
    console.log('Fetched team members from RPC:', project.team);
    
    // If there's team data in the project, use it
    if (project.team && Array.isArray(project.team)) {
      // Properly type and access each team member object
      return project.team.map((member: any) => ({
        id: member.id || String(Date.now()),
        name: member.name || 'Team Member', // Use the actual name field
        role: member.role || 'Member',
        user_id: member.user_id
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error in fetchProjectTeamMembers:', error);
    return [];
  }
};

/**
 * Fetches the name of the project manager
 */
export const fetchProjectManagerName = async (projectId: string, managerId: string): Promise<string> => {
  try {
    if (!managerId || !projectId) return 'Not assigned';
    
    // Try to find the manager in the project_members table
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('name')
      .eq('project_id', projectId)
      .eq('user_id', managerId)
      .maybeSingle();
    
    if (!memberError && memberData && memberData.name) {
      return memberData.name;
    }
    
    // If not found in project_members, try to find in profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', managerId)
      .maybeSingle();
    
    if (!profileError && profileData && profileData.full_name) {
      return profileData.full_name;
    }
    
    return 'Unknown Manager';
  } catch (error) {
    console.error('Error fetching project manager name:', error);
    return 'Unknown Manager';
  }
};

export const fetchTeamManagerName = fetchProjectManagerName;
