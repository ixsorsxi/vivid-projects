
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectForm } from '@/hooks/useProjectForm';
import { createProject } from '@/api/projects/projectCrud';
import { useAuth } from '@/context/auth';

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

    if (!user) {
      toast.error(`Error`, {
        description: "You must be logged in to create a project"
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
      
      // Save to Supabase with better error handling
      const projectId = await createProject(projectData, user.id);
      
      if (projectId) {
        toast(`Success`, {
          description: `Project "${projectName}" created successfully`
        });
        
        setIsOpen(false);
        navigate('/projects/' + projectId);
      } else {
        // Error toast already shown in createProject function
        // Just reset the submitting state
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(`Error`, {
        description: "An unexpected error occurred while creating the project"
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
