
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

    // Find the project manager in the team members (if any)
    let projectManagerId = null;
    if (projectFormData.teamMembers && projectFormData.teamMembers.length > 0) {
      const projectManager = projectFormData.teamMembers.find(
        member => member.role?.toLowerCase() === 'project manager'
      );
      if (projectManager && projectManager.id) {
        projectManagerId = projectManager.id;
        console.log('Setting project manager ID:', projectManagerId);
      }
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
      project_manager_id: projectManagerId,
      project_type: projectFormData.projectType || 'Development',
      estimated_cost: parseFloat(projectFormData.budget) || 0
    };

    console.log('Creating project with data:', projectData);

    // Insert the project
    const { data: newProject, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating project:', error);
      const apiError = handleDatabaseError(error);
      
      // Display appropriate error message
      toast.error('Failed to create project', {
        description: apiError.message || 'An unexpected error occurred'
      });
      return null;
    }

    if (!newProject || !newProject.id) {
      console.error('No project ID returned from project creation');
      toast.error('Project creation failed', {
        description: 'Unable to create project. Please try again later.'
      });
      return null;
    }

    const projectId = newProject.id;

    // If we have team members, add them
    if (projectFormData.teamMembers && projectFormData.teamMembers.length > 0) {
      console.log('Adding team members to project:', projectId);
      
      // Create an array of team member objects for insertion
      const teamMembersData = projectFormData.teamMembers.map(member => ({
        project_id: projectId,
        user_id: member.id || userId, // Use the actual user ID if available
        name: member.name,
        role: member.role || 'Team Member'
      }));
      
      const { error: teamMembersError } = await supabase
        .from('project_members')
        .insert(teamMembersData);
        
      if (teamMembersError) {
        console.warn('Error adding team members, but project was created:', teamMembersError);
      }
    }

    // If we have tasks, add them
    if (projectFormData.tasks && projectFormData.tasks.length > 0) {
      console.log('Adding tasks to project:', projectId);
      
      // Create an array of task objects for insertion
      const tasksData = projectFormData.tasks.map(task => ({
        project_id: projectId,
        user_id: userId,
        title: task.title,
        description: task.description || '',
        status: task.status || 'to-do',
        priority: task.priority || 'medium',
        due_date: task.dueDate || null
      }));
      
      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksData);
        
      if (tasksError) {
        console.warn('Error adding tasks, but project was created:', tasksError);
      }
    }

    console.log('Project created successfully:', projectId);
    
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
