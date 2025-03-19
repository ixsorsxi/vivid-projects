
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
    const projectData = {
      name: projectFormData.projectName,
      description: projectFormData.projectDescription,
      category: projectFormData.projectCategory || null,
      due_date: projectFormData.dueDate || null,
      status: 'not-started',
      progress: 0,
      user_id: userId,
      team_members: projectFormData.teamMembers || [],
      tasks: projectFormData.tasks || []
    };

    console.log('Creating project with data:', projectData);

    // Use RPC function to create project (bypassing RLS)
    const { data, error } = await supabase
      .rpc('create_new_project', { 
        project_data: {
          name: projectData.name,
          description: projectData.description,
          category: projectData.category,
          due_date: projectData.due_date,
          status: projectData.status,
          progress: projectData.progress,
          user_id: projectData.user_id
        }
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

    const projectId = data;
    
    if (!projectId) {
      console.error('No project ID returned from create_new_project function');
      toast.error('Project creation failed', {
        description: 'Unable to create project. Please try again later.'
      });
      return null;
    }

    // If we have team members, add them through a separate RPC function
    if (projectId && projectFormData.teamMembers && projectFormData.teamMembers.length > 0) {
      console.log('Adding team members to project:', projectId);
      
      const teamMembersResult = await supabase
        .rpc('add_project_members', { 
          p_project_id: projectId,
          p_user_id: userId,
          p_team_members: projectFormData.teamMembers.map(member => ({
            role: member.role || 'member',
            name: member.name
          }))
        });
        
      if (teamMembersResult.error) {
        console.warn('Error adding team members, but project was created:', teamMembersResult.error);
      }
    }

    // If we have tasks, add them through a separate RPC function
    if (projectId && projectFormData.tasks && projectFormData.tasks.length > 0) {
      console.log('Adding tasks to project:', projectId);
      
      const tasksResult = await supabase
        .rpc('add_project_tasks', { 
          p_project_id: projectId,
          p_user_id: userId,
          p_tasks: projectFormData.tasks.map(task => ({
            title: task.title,
            description: task.description || '',
            status: task.status || 'to-do',
            priority: task.priority || 'medium',
            due_date: task.dueDate || null
          }))
        });
        
      if (tasksResult.error) {
        console.warn('Error adding tasks, but project was created:', tasksResult.error);
      }
    }

    console.log('Project created successfully:', projectId);
    
    toast.success('Project created', {
      description: 'Your new project has been created successfully.'
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
