
import { supabase } from '@/integrations/supabase/client';
import { ProjectFormState } from '@/hooks/useProjectForm';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectCreateData, ProjectApiError, ProjectTeamMemberData, ProjectTaskData } from './types';
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
    const projectForDb: ProjectCreateData = {
      name: projectFormData.projectName,
      description: projectFormData.projectDescription,
      category: projectFormData.projectCategory || undefined,
      due_date: projectFormData.dueDate || undefined,
      status: 'not-started', // Use valid ProjectStatus value
      progress: 0,
      user_id: userId
    };

    console.log('Creating project with data:', projectForDb);

    // Insert the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert(projectForDb)
      .select('id')
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      const apiError = handleDatabaseError(projectError);
      
      // Display appropriate error message
      toast.error('Failed to create project', {
        description: apiError.message || 'An unexpected error occurred'
      });
      return null;
    }

    const projectId = projectData?.id;

    // If we have a project ID, add team members
    if (projectId && projectFormData.teamMembers && projectFormData.teamMembers.length > 0) {
      console.log('Adding team members to project:', projectId);
      
      // Prepare team members data
      const teamMembersForDb = projectFormData.teamMembers.map(member => ({
        project_id: projectId,
        user_id: userId, // For now, associate with the project creator as we don't have real user IDs
        role: member.role || 'member',
        name: member.name
      }));
      
      // Insert team members
      const { error: teamError } = await supabase
        .from('project_members')
        .insert(teamMembersForDb);
        
      if (teamError) {
        console.warn('Error adding team members, but project was created:', teamError);
      }
    }

    // If we have tasks, add them to the database
    if (projectId && projectFormData.tasks && projectFormData.tasks.length > 0) {
      console.log('Adding tasks to project:', projectId);
      
      // Prepare tasks data
      const tasksForDb = projectFormData.tasks.map(task => ({
        title: task.title,
        description: task.description || '',
        status: task.status || 'to-do',
        priority: task.priority || 'medium',
        due_date: task.dueDate || null,
        completed: false,
        project_id: projectId,
        user_id: userId
      }));
      
      // Insert tasks
      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksForDb);
        
      if (tasksError) {
        console.warn('Error adding tasks, but project was created:', tasksError);
      }
    }

    console.log('Project created successfully:', projectData);
    
    toast.success('Project created', {
      description: 'Your new project has been created successfully.'
    });

    return projectId || null;
  } catch (error) {
    const err = error as Error;
    console.error('Exception in createProject:', err);
    
    toast.error('Unexpected error', {
      description: 'Failed to create project due to a system error. Please try again later.'
    });
    return null;
  }
};
