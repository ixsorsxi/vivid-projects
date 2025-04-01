
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectStatus } from '@/lib/types/common';
import { timeoutPromise, handleDatabaseError } from './utils';

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    if (!projectId) {
      console.error('No project ID provided');
      return null;
    }

    console.log('Attempting to fetch project with ID:', projectId);
    
    // Use the get_project_by_id RPC function to avoid RLS recursion
    const { data: projectData, error } = await supabase
      .rpc('get_project_by_id', { p_project_id: projectId });

    if (error) {
      console.error('Error fetching project:', error);
      throw handleDatabaseError(error);
    }

    if (!projectData || projectData.length === 0) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    console.log('Successfully fetched project:', projectData[0]);

    // Extract the first result and its team data
    const project = projectData[0];
    
    // Process team members data with fallbacks
    let teamMembers: Array<{id: number; name: string; role: string}> = [];
    
    if (project.team && Array.isArray(project.team)) {
      teamMembers = project.team.map(member => {
        // Cast the member to any to safely extract properties
        const memberObj = member as any;
        return {
          id: memberObj.id || 0,
          name: memberObj.name || memberObj.role || 'Team Member',
          role: memberObj.role || 'Member'
        };
      });
    }

    console.log('Project category from database:', project.category);

    // Transform database record to Project type
    return {
      id: project.id,
      name: project.name || '', // Ensure name has a fallback
      description: project.description || '',
      progress: project.progress || 0,
      status: project.status as ProjectStatus,
      dueDate: project.due_date || '',
      category: project.category || '', // Ensure category has a fallback
      members: teamMembers.map(t => ({ id: String(t.id), name: t.name })), // Convert to members format
      team: teamMembers // Full team data with roles
    };
  } catch (error) {
    console.error('Error in fetchProjectById:', error);
    throw error;
  }
};

export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    if (!userId) {
      console.error('No user ID provided for fetching projects');
      return [];
    }

    console.log('Fetching projects for user ID:', userId);
    
    // Use the security definer function to avoid RLS recursion
    const { data, error } = await supabase
      .rpc('get_user_projects');

    if (error) {
      console.error('Error fetching projects:', error);
      throw handleDatabaseError(error);
    }

    console.log('Successfully fetched projects:', data);

    // Transform database records to Project type
    return (data || []).map(proj => ({
      id: proj.id,
      name: proj.name,
      description: proj.description || '',
      progress: proj.progress || 0,
      status: proj.status as ProjectStatus,
      dueDate: proj.due_date || '',
      category: proj.category || '',
      members: []
    }));
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    throw error;
  }
};
