
import { supabase } from '@/integrations/supabase/client';
import { ProjectFormState } from '@/hooks/project-form/types';
import { toast } from '@/components/ui/toast-wrapper';
import { handleDatabaseError } from './utils';

// Create a project in the database
export const createProject = async (projectFormData: ProjectFormState, userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided for project creation');
      toast.error('Project creation failed', {
        description: 'User information is missing. Please try logging in again.'
      });
      return null;
    }

    // Prepare project data for insertion
    const projectData = {
      name: projectFormData.projectName,
      description: projectFormData.projectDescription,
      category: projectFormData.projectCategory || null,
      due_date: projectFormData.dueDate || null,
      status: 'not-started',
      progress: 0,
      user_id: userId,
      project_type: projectFormData.projectType || 'Development',
      estimated_cost: parseFloat(projectFormData.budget) || 0
    };

    console.log('Creating project with data:', projectData);

    // Use the RPC function instead of direct table access
    const { data, error } = await supabase.rpc('create_new_project', {
      project_data: projectData
    });

    if (error) {
      console.error('Error creating project:', error);
      const apiError = handleDatabaseError(error);
      
      // Display appropriate error message
      toast.error('Failed to create project', {
        description: apiError.message || 'An unexpected error occurred'
      });
      return null;
    }

    // The RPC function returns the new project ID
    const projectId = data;
    
    if (!projectId) {
      console.error('No project ID returned from project creation');
      toast.error('Project creation failed', {
        description: 'Unable to create project. Please try again later.'
      });
      return null;
    }

    console.log('Project created successfully with ID:', projectId);

    // If we have tasks, add them
    if (projectFormData.tasks && projectFormData.tasks.length > 0 && projectId) {
      console.log('Adding tasks to project:', projectId);
      
      try {
        // Convert ProjectTask[] to a format compatible with Json type
        const tasksJson = JSON.parse(JSON.stringify(projectFormData.tasks));
        
        // Use an RPC function to add tasks
        const { error: taskError } = await supabase.rpc('add_project_tasks', {
          p_project_id: projectId,
          p_user_id: userId,
          p_tasks: tasksJson
        });
        
        if (taskError) {
          console.warn('Error adding tasks, but project was created:', taskError);
        }
      } catch (taskErr) {
        console.warn('Exception adding tasks, but project was created:', taskErr);
      }
    }

    console.log('Project created successfully:', projectId);
    
    // Show a helpful message about team member management
    toast.success('Project created successfully', {
      description: 'You can now add team members in the project details page under the Team tab.'
    });
    
    return projectId;
  } catch (error) {
    const err = error as Error;
    console.error('Exception in createProject:', err);
    
    toast.error('Unexpected error', {
      description: 'Failed to create project due to a system error. Please try again later.'
    });
    return null;
  }
};
