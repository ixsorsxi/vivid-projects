
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectStatus, TeamMember } from '@/lib/types/common';
import { timeoutPromise, handleDatabaseError } from './utils';

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    if (!projectId) {
      console.error('No project ID provided');
      return null;
    }

    console.log('Attempting to fetch project with ID:', projectId);
    
    // Use RPC function to fetch project data
    const { data, error } = await supabase
      .rpc('get_project_by_id', { p_project_id: projectId });

    if (error) {
      console.error('Error fetching project:', error);
      throw handleDatabaseError(error);
    }

    if (!data || data.length === 0) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    const projectData = data[0];
    console.log('Successfully fetched project:', projectData);

    // Make sure team is properly typed as TeamMember[]
    let team: TeamMember[] = [];
    if (projectData.team && Array.isArray(projectData.team)) {
      team = projectData.team.map((member: any) => ({
        id: member.id,
        name: member.name || 'Unknown',
        role: member.role || 'Member'
      }));
    }

    // Transform database record to Project type
    return {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description || '',
      progress: projectData.progress || 0,
      status: projectData.status as ProjectStatus,
      dueDate: projectData.due_date || '',
      category: projectData.category || '',
      team: team
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
