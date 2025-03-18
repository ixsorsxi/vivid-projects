
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectFormState, Phase, Milestone } from '@/hooks/useProjectForm';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectStatus } from '@/lib/types/common';

export interface ProjectCreateData {
  name: string;
  description: string;
  category?: string;
  due_date?: string;
  status: ProjectStatus;
  progress?: number;
  user_id: string;
}

// Create a project in the database
export const createProject = async (projectData: ProjectFormState, userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided for project creation');
      toast.error('Project creation failed', {
        description: 'User information is missing. Please try logging in again.'
      });
      return null;
    }

    // Prepare project data for insertion
    const projectForDb: ProjectCreateData = {
      name: projectData.projectName,
      description: projectData.projectDescription,
      category: projectData.projectCategory || undefined,
      due_date: projectData.dueDate || undefined,
      status: 'not-started', // Use valid ProjectStatus value
      progress: 0,
      user_id: userId
    };

    console.log('Creating project with data:', projectForDb);

    // Try to insert with a timeout to avoid hanging
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000); // 5 second timeout
    });

    const insertPromise = supabase
      .from('projects')
      .insert(projectForDb)
      .select('id')
      .single();

    // Race the database insert against the timeout
    const result = await Promise.race([insertPromise, timeoutPromise]);
    
    if (!result) {
      console.error('Project creation timed out');
      toast.error('Project creation timed out', {
        description: 'The operation took too long. Please try again later.'
      });
      return null;
    }

    const { data, error } = result as typeof insertPromise extends Promise<infer T> ? T : never;

    if (error) {
      console.error('Error creating project:', error);
      
      // Handle specific error cases
      if (error.message?.includes('infinite recursion')) {
        toast.error('Project creation failed', {
          description: 'There is an issue with database permissions. Please try again later.'
        });
      } else if (error.message?.includes('violates row-level security')) {
        toast.error('Permission denied', {
          description: 'You do not have permission to create projects.'
        });
      } else {
        toast.error('Failed to create project', {
          description: error.message || 'An unexpected error occurred'
        });
      }
      return null;
    }

    console.log('Project created successfully:', data);

    // If there are phases, add them as well (in a real app, this would be in a dedicated table)
    if (projectData.phases && projectData.phases.length > 0) {
      console.log(`Adding ${projectData.phases.length} phases to the project...`);
      // This would insert phases into a phases table
      // For now, we'll just log them
      projectData.phases.forEach(phase => {
        console.log(`Phase: ${phase.name}, Milestones: ${phase.milestones.length}`);
      });
    }

    return data?.id || null;
  } catch (error: any) {
    console.error('Exception in createProject:', error);
    toast.error('Unexpected error', {
      description: 'Failed to create project due to a system error. Please try again later.'
    });
    return null;
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    if (!projectId) {
      console.error('No project ID provided');
      return null;
    }

    // Try to fetch with a timeout to avoid hanging
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000); // 5 second timeout
    });

    const fetchPromise = supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    // Race the database fetch against the timeout
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!result) {
      console.error('Project fetch timed out');
      toast.error('Request timed out', {
        description: 'The operation took too long. Please try again later.'
      });
      return null;
    }

    const { data, error } = result as typeof fetchPromise extends Promise<infer T> ? T : never;

    if (error) {
      console.error('Error fetching project:', error);
      
      if (error.message?.includes('infinite recursion')) {
        toast.error('Permission error', {
          description: 'There is an issue with database configuration. Please try again later.'
        });
      }
      
      return null;
    }

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
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000); // 5 second timeout
    });

    const fetchPromise = supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Race the database fetch against the timeout
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!result) {
      console.error('Projects fetch timed out');
      throw new Error('Request timed out. The operation took too long.');
    }

    const { data, error } = result as typeof fetchPromise extends Promise<infer T> ? T : never;

    if (error) {
      console.error('Error fetching user projects:', error);
      
      // Handle specific error cases
      if (error.message?.includes('infinite recursion')) {
        throw new Error('infinite recursion detected in policy for relation "projects"');
      } else if (error.message?.includes('violates row-level security')) {
        throw new Error('Permission denied: You do not have permission to view these projects.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }

    console.log("Fetched projects:", data);

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
  } catch (error: any) {
    console.error('Error in fetchUserProjects:', error);
    throw error;
  }
};
