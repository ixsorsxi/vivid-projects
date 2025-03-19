
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
    
    // Use the direct query to projects table with join to project_members
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        progress,
        status,
        due_date,
        category,
        user_id
      `)
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      throw handleDatabaseError(error);
    }

    if (!data) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    console.log('Successfully fetched project:', data);

    // Fetch team members for this project - Note: Using RPC to get project team members to avoid type errors
    const { data: teamData, error: teamError } = await supabase
      .rpc('get_project_by_id', { p_project_id: projectId });

    if (teamError) {
      console.error('Error fetching team members:', teamError);
    }

    // Extract team members from the RPC result
    const teamMembers = teamData && teamData.length > 0 && teamData[0].team 
      ? teamData[0].team 
      : [];

    // Transform database record to Project type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      progress: data.progress || 0,
      status: data.status as ProjectStatus,
      dueDate: data.due_date || '',
      category: data.category || '',
      members: [], // Basic members array for compatibility
      team: teamMembers // Add full team data from RPC call
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
