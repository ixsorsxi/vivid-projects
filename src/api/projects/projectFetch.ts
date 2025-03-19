
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
    
    // Simplified query to avoid RLS recursion issues
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description, progress, status, due_date, category')
      .eq('id', projectId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching project:', error);
      throw handleDatabaseError(error);
    }

    if (!data) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    console.log('Successfully fetched project:', data);

    // Transform database record to Project type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      progress: data.progress || 0,
      status: data.status as ProjectStatus,
      dueDate: data.due_date || '',
      category: data.category || '',
      // Members would be fetched separately in a real implementation
      members: []
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
    
    // Simplified query to avoid RLS recursion
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description, progress, status, due_date, category')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
