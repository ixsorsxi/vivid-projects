
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';
import { handleDatabaseError } from '../../utils';

/**
 * Fetches a project by ID directly from the projects table
 */
export const fetchProjectByIdDirect = async (projectId: string): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching project by ID:', error);
      handleDatabaseError(error);
      return null;
    }

    if (!data) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    // Convert the data structure to match our Project interface
    const project: Project = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      progress: data.progress || 0,
      status: data.status as ProjectStatus,
      dueDate: data.due_date || '',
      category: data.category || 'General',
      project_type: data.project_type || 'Standard',
    };

    return project;
  } catch (error) {
    console.error('Exception in fetchProjectByIdDirect:', error);
    return null;
  }
};
