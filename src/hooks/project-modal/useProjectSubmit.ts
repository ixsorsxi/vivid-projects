
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { createProject } from '@/api/projects';
import { useAuth } from '@/context/auth';

export const useProjectSubmit = (
  formData: {
    projectName: string;
    projectDescription: string;
    projectCategory: string;
    dueDate: string;
    isPrivate: boolean;
    projectCode: string;
    budget: string;
    currency: string;
    phases: any[];
    tasks: any[];
    teamMembers: any[];
  },
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
      
      // Create project in database
      const projectId = await createProject(formData, user.id);
      
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
          description: 'Unable to save your project. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      toast.error(`Error`, {
        description: "An unexpected error occurred while creating the project. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleCreateProject };
};
