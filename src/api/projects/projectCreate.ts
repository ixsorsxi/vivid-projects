
import { supabase } from '@/integrations/supabase/client';
import { ProjectFormState } from '@/hooks/useProjectForm';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectCreateData, ProjectApiError } from './types';
import { handleDatabaseError, timeoutPromise } from './utils';

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
    const insertPromise = supabase
      .from('projects')
      .insert(projectForDb)
      .select('id')
      .single();

    // Race the database insert against the timeout
    const result = await Promise.race([insertPromise, timeoutPromise<typeof insertPromise>(5000)]);
    
    if (!result) {
      console.error('Project creation timed out');
      toast.error('Project creation timed out', {
        description: 'The operation took too long. Please try again later.'
      });
      return null;
    }

    const { data, error } = result;

    if (error) {
      const apiError = handleDatabaseError(error);
      
      // Display appropriate error message
      if (apiError.message.includes('infinite recursion')) {
        toast.error('Project creation failed', {
          description: 'There is an issue with database permissions. Please try again later.'
        });
      } else if (apiError.message.includes('violates row-level security')) {
        toast.error('Permission denied', {
          description: 'You do not have permission to create projects.'
        });
      } else {
        toast.error('Failed to create project', {
          description: apiError.message || 'An unexpected error occurred'
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
  } catch (error) {
    const err = error as Error;
    console.error('Exception in createProject:', err);
    toast.error('Unexpected error', {
      description: 'Failed to create project due to a system error. Please try again later.'
    });
    return null;
  }
};
