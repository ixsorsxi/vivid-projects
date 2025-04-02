
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/lib/types/common';
import { useAuth } from '@/context/auth';

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
    
    // Try to fetch from project_members table directly using RPC to avoid RLS issues
    try {
      console.log('Trying to use project members RPC function');
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_project_by_id', { p_project_id: projectId });
      
      if (!rpcError && rpcData) {
        const project = Array.isArray(rpcData) ? rpcData[0] : rpcData;
        
        if (project && project.team && Array.isArray(project.team)) {
          console.log('Got team members from RPC:', project.team);
          return project.team.map((t: any) => ({
            id: t.id,
            name: t.name || 'Team Member',
            role: t.role || 'Member',
            user_id: t.user_id
          }));
        }
      }
    } catch (rpcError) {
      console.error('Error using RPC function:', rpcError);
    }
    
    // If RPC fails, try to fetch from project_members table directly
    try {
      const { data: teamMembers, error: teamError } = await supabase
        .from('project_members')
        .select('id, user_id, name, role')
        .eq('project_id', projectId);
      
      if (teamError) {
        if (teamError.code === '42P17') {
          console.error('RLS recursion error fetching team members:', teamError);
        } else {
          console.error('Error fetching team members:', teamError);
        }
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
      }
    } catch (error) {
      console.error('Error fetching team members directly:', error);
    }
    
    // As a last fallback, try to get team members from the project data
    console.log('Fetching team members from project data as fallback');
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .single();
      
      if (projectError || !projectData) {
        console.error('Error fetching project by ID:', projectError);
        return [];
      }
      
      // If we got here but couldn't get team members, return empty array
      console.warn('Project exists but no team members found');
      return [];
    } catch (finalError) {
      console.error('Final error in fetchProjectTeamMembers:', finalError);
      return [];
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
    if (!managerId || !projectId) {
      console.log('No manager ID or project ID provided');
      return 'Not assigned';
    }
    
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
    
    console.log('Manager not found in any table');
    return 'Not assigned';
  } catch (error) {
    console.error('Error fetching project manager name:', error);
    return 'Unknown Manager';
  }
};

export const fetchTeamManagerName = fetchProjectManagerName;
