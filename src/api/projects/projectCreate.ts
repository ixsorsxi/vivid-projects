
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';

interface ProjectCreateParams {
  name: string;
  description?: string;
  status?: string;
  dueDate?: string;
  category?: string;
}

interface ProjectCreateResponse {
  success: boolean;
  project: Project | null;
  message?: string;
}

export const createProject = async (params: ProjectCreateParams): Promise<ProjectCreateResponse> => {
  try {
    // Check for required fields
    if (!params.name.trim()) {
      return {
        success: false,
        project: null,
        message: 'Project name is required'
      };
    }

    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      return {
        success: false,
        project: null,
        message: 'You must be logged in to create a project'
      };
    }

    // Create the project
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: params.name,
        description: params.description || '',
        status: params.status || 'in-progress',
        user_id: userId,
        due_date: params.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days from now
        category: params.category || 'Development'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return {
        success: false,
        project: null,
        message: error.message
      };
    }

    // Format the response
    const project: Project = {
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      dueDate: data.due_date,
      progress: data.progress || 0,
      category: data.category,
      project_type: data.project_type
    };

    return {
      success: true,
      project
    };
  } catch (error) {
    console.error('Exception in createProject:', error);
    return {
      success: false,
      project: null,
      message: 'An unexpected error occurred'
    };
  }
};
