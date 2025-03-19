
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

    // Try to fetch with a timeout to avoid hanging
    const fetchPromise = supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    // Race the database fetch against the timeout
    const result = await Promise.race([fetchPromise, timeoutPromise<typeof fetchPromise>(5000)]);
    
    if (!result) {
      console.error('Project fetch timed out');
      toast.error('Request timed out', {
        description: 'The operation took too long. Please try again later.'
      });
      return null;
    }

    const { data, error } = result;

    if (error) {
      const apiError = handleDatabaseError(error);
      
      if (apiError.message.includes('infinite recursion')) {
        toast.error('Permission error', {
          description: 'There is an issue with database configuration. Please try again later.'
        });
      }
      
      return null;
    }

    if (!data) return null;

    // Transform database record to Project type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      progress: data.progress || 0,
      status: data.status as ProjectStatus, // Cast to ProjectStatus
      dueDate: data.due_date || '',
      category: data.category || '',
      // We would fetch members from a separate table in a real implementation
      members: []
    };
  } catch (error) {
    console.error('Error in fetchProjectById:', error);
    return null;
  }
};

export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    if (!userId) {
      console.error('No user ID provided for fetching projects');
      return [];
    }

    // Try to fetch with a timeout to avoid hanging
    const fetchPromise = supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Race the database fetch against the timeout
    const result = await Promise.race([fetchPromise, timeoutPromise<typeof fetchPromise>(5000)]);
    
    if (!result) {
      console.error('Projects fetch timed out');
      throw new Error('Request timed out. The operation took too long.');
    }

    const { data, error } = result;

    if (error) {
      throw handleDatabaseError(error);
    }

    // Transform database records to Project type
    return (data || []).map(proj => ({
      id: proj.id,
      name: proj.name,
      description: proj.description || '',
      progress: proj.progress || 0,
      status: proj.status as ProjectStatus, // Cast to ProjectStatus
      dueDate: proj.due_date || '',
      category: proj.category || '',
      members: []
    }));
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    throw error;
  }
};
