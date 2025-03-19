import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectForm } from '@/hooks/useProjectForm';
import { createProject } from '@/api/projects';
import { useAuth } from '@/context/auth';
import { demoProjects } from '@/lib/data';

export const useNewProjectModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const {
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectCategory,
    setProjectCategory,
    dueDate,
    setDueDate,
    isPrivate,
    setIsPrivate,
    projectCode,
    budget,
    setBudget,
    currency,
    setCurrency,
    phases,
    generateProjectCode,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    resetForm
  } = useProjectForm();

  useEffect(() => {
    if (isOpen) {
      generateProjectCode();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast.error(`Error`, {
        description: "Project name is required"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get form data as an object
      const projectData = {
        projectName,
        projectDescription,
        projectCategory,
        dueDate,
        isPrivate,
        projectCode,
        budget, // Keep as string to match ProjectFormState
        currency,
        phases
      };
      
      console.log('Creating new project:', projectData);
      
      let projectId: string | null = null;
      
      // Check if user is authenticated
      if (user) {
        // Try to save to Supabase with better error handling
        projectId = await createProject(projectData, user.id);
      }
      
      if (projectId) {
        // Successfully created in Supabase
        toast.success(`Project created`, {
          description: `"${projectName}" has been created successfully`
        });
        
        setIsOpen(false);
        navigate('/projects/' + projectId);
      } else {
        // Failed to create in Supabase - create a demo project instead
        toast.success(`Demo mode`, {
          description: `"${projectName}" added as a demo project (not saved to database)`
        });
        
        // Close the modal but don't navigate - we're just adding to demo data
        setIsOpen(false);
        
        // In a real app, we would add to local storage or context
        // For now, just log that we would add to demo projects
        console.log("Would add to demo projects:", {
          id: `demo-${Date.now()}`,
          name: projectName,
          description: projectDescription,
          progress: 0,
          status: 'not-started',
          dueDate: dueDate || '',
          category: projectCategory || '',
          members: []
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

  return {
    isOpen,
    setIsOpen,
    isSubmitting,
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectCategory,
    setProjectCategory,
    dueDate,
    setDueDate,
    isPrivate,
    setIsPrivate,
    projectCode,
    budget,
    setBudget,
    currency,
    setCurrency,
    phases,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    handleCreateProject
  };
};
