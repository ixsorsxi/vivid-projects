
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
    
    // Method 1: Try direct query with explicit SELECT
    try {
      console.log('Trying direct query to project_members table');
      const { data: teamMembers, error: teamError } = await supabase
        .from('project_members')
        .select('id, user_id, name, role')
        .eq('project_id', projectId);
      
      if (!teamError && teamMembers && teamMembers.length > 0) {
        console.log('Raw team members from database:', teamMembers);
        
        // Transform to TeamMember type with proper defaults
        return teamMembers.map(t => ({ 
          id: t.id || String(Date.now()), 
          name: t.name || 'Unnamed', 
          role: t.role || 'Member',
          user_id: t.user_id
        }));
      }
      
      if (teamError) {
        console.error('Error fetching team members:', teamError);
      }
    } catch (error) {
      console.error('Error fetching team members directly:', error);
    }
    
    // Method 2: Try direct RPC call to get_project_by_id which includes team data
    try {
      console.log('Trying to use get_project_by_id RPC function');
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_project_by_id', { p_project_id: projectId });
      
      if (!rpcError && rpcData) {
        const project = Array.isArray(rpcData) ? rpcData[0] : rpcData;
        
        if (project && project.team && Array.isArray(project.team)) {
          console.log('Got team members from RPC:', project.team);
          return project.team.map((t: any) => ({
            id: t.id || String(Date.now()),
            name: t.name || 'Team Member',
            role: t.role || 'Member',
            user_id: t.user_id
          }));
        }
      } else if (rpcError) {
        console.log('RPC error:', rpcError.message);
      }
    } catch (rpcError) {
      console.error('Error using RPC function:', rpcError);
    }
    
    // Method 3: Try using auth.uid() explicitly
    const { data: authData } = await supabase.auth.getUser();
    if (authData && authData.user) {
      try {
        console.log('Trying query with explicit user context:', authData.user.id);
        const { data: contextMembers, error: contextError } = await supabase
          .from('project_members')
          .select('id, user_id, name, role')
          .eq('project_id', projectId)
          .or(`user_id.eq.${authData.user.id},user_id.is.null`);
        
        if (!contextError && contextMembers && contextMembers.length > 0) {
          console.log('Team members with user context:', contextMembers);
          return contextMembers.map(t => ({
            id: t.id || String(Date.now()),
            name: t.name || 'Team Member',
            role: t.role || 'Member',
            user_id: t.user_id
          }));
        }
      } catch (contextError) {
        console.error('Error using context approach:', contextError);
      }
    }
    
    // Method 4: As a last fallback, try to verify project exists
    console.log('Verifying project exists as fallback');
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .maybeSingle();
      
      if (projectError) {
        console.error('Error fetching project by ID:', projectError);
      } else if (projectData) {
        console.log('Project exists but no team members found');
      }
    } catch (finalError) {
      console.error('Final error in fetchProjectTeamMembers:', finalError);
    }
    
    // If all methods fail, return empty array
    console.log('No team members found after all attempts');
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
      return 'Not Assigned';
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
    return 'Not Assigned';
  } catch (error) {
    console.error('Error fetching project manager name:', error);
    return 'Unknown Manager';
  }
};

export const fetchTeamManagerName = fetchProjectManagerName;
