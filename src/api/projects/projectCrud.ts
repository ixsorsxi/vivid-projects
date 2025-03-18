
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectFormState, Phase, Milestone } from '@/hooks/useProjectForm';
import { toast } from '@/components/ui/toast-wrapper';

export interface ProjectCreateData {
  name: string;
  description: string;
  category?: string;
  due_date?: string;
  status: string;
  progress?: number;
  user_id: string;
}

// Create a project in the database
export const createProject = async (projectData: ProjectFormState, userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided for project creation');
      return null;
    }

    // Prepare project data for insertion
    const projectForDb: ProjectCreateData = {
      name: projectData.projectName,
      description: projectData.projectDescription,
      category: projectData.projectCategory || undefined,
      due_date: projectData.dueDate || undefined,
      status: 'not-started',
      progress: 0,
      user_id: userId
    };

    console.log('Creating project with data:', projectForDb);

    // Insert the project
    const { data, error } = await supabase
      .from('projects')
      .insert(projectForDb)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project', {
        description: error.message
      });
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

    return data.id;
  } catch (error) {
    console.error('Exception in createProject:', error);
    return null;
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    // Transform database record to Project type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      progress: data.progress || 0,
      status: data.status,
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
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user projects:', error);
      return [];
    }

    // Transform database records to Project type
    return data.map(proj => ({
      id: proj.id,
      name: proj.name,
      description: proj.description || '',
      progress: proj.progress || 0,
      status: proj.status,
      dueDate: proj.due_date || '',
      category: proj.category || '',
      members: []
    }));
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    return [];
  }
};
