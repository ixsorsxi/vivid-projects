
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { createProject } from '@/api/projects';
import { useAuth } from '@/context/auth';
import { ProjectFormState } from '@/hooks/project-form/types';

export const useProjectSubmit = (
  formData: Omit<ProjectFormState, 'teamMembers'>,
  setIsSubmitting: (value: boolean) => void,
  setIsOpen: (value: boolean) => void,
  resetForm: () => void
) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName.trim()) {
      toast.error(`Error`, {
        description: "Project name is required"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      if (!user || !user.id) {
        toast.error('Authentication required', {
          description: 'You must be logged in to create a project'
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Submitting project with data:', formData);
      
      // Add empty teamMembers array to meet the API requirements
      const completeFormData = {
        ...formData,
        teamMembers: []
      };
      
      // Try to use the RPC function to create the project bypassing RLS
      const projectId = await createProject(completeFormData, user.id);
      
      if (projectId) {
        // Successfully created in Supabase
        toast.success(`Project created`, {
          description: `"${formData.projectName}" has been created successfully`
        });
        
        setIsOpen(false);
        resetForm();
        navigate('/projects/' + projectId);
      } else {
        // Failed to create in database
        toast.error('Project creation failed', {
          description: 'Unable to save your project. Please try again or contact support if the issue persists.'
        });
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      // Improve error handling to show more specific error messages
      let errorMessage = "An unexpected error occurred while creating the project. Please try again later.";
      
      if (error.message && error.message.includes('recursion')) {
        errorMessage = "Database configuration issue. Please contact support.";
      } else if (error.message && error.message.includes('permission')) {
        errorMessage = "You don't have permission to create projects. Please contact your administrator.";
      }
      
      toast.error(`Error`, {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleCreateProject };
};
