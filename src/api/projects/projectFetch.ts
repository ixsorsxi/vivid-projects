
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
      .maybeSingle();

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
      console.error('Error fetching project:', error);
      
      // Check for infinite recursion error specifically
      if (error.message && error.message.includes('infinite recursion')) {
        toast.error('Database configuration issue', {
          description: 'Unable to fetch project due to a policy configuration issue. Please contact support.'
        });
        return null;
      }
      
      throw handleDatabaseError(error);
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
    
    // Attempt to fetch the projects with a timeout
    const fetchPromise = supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Race the database fetch against the timeout
    const result = await Promise.race([fetchPromise, timeoutPromise<typeof fetchPromise>(8000)]);
    
    if (!result) {
      console.error('Projects fetch timed out');
      throw new Error('Request timed out. The operation took too long.');
    }

    const { data, error } = result;

    if (error) {
      console.error('Error fetching projects:', error);
      
      // Check for infinite recursion error specifically
      if (error.message && error.message.includes('infinite recursion')) {
        toast.error('Database configuration issue', {
          description: 'We detected a policy configuration issue. Using demo data instead.'
        });
        return [];
      }
      
      throw handleDatabaseError(error);
    }

    console.log('Successfully fetched projects:', data);

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
