
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

// Remove the addProjectTeamMember implementation here to avoid duplicate functions
// with different implementations. We'll use the one from teamOperations.ts

// Remove the removeProjectTeamMember implementation here to avoid duplicate functions
// with different implementations. We'll use the one from teamOperations.ts

// Fix to remove duplicate exports by importing and re-exporting the specific functions we need
export * from './team/teamOperations';
export * from './team/types';

// Import and re-export the necessary functions from fetchTeamMembers
import { fetchTeamManagerName } from './team/fetchTeamMembers';
export { fetchTeamManagerName };

// Export the projectManager functions but not the fetchProjectManagerName
export { findProjectManager } from './team/projectManager';
