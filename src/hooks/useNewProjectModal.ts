
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectForm } from '@/hooks/useProjectForm';
import { createProject } from '@/api/projects';
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
    tasks,
    teamMembers,
    generateProjectCode,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addTask,
    updateTask,
    removeTask,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
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
        budget,
        currency,
        phases,
        tasks,
        teamMembers
      };
      
      console.log('Creating new project:', projectData);
      
      // Check if user is authenticated
      if (!user || !user.id) {
        toast.error('Authentication required', {
          description: 'You must be logged in to create a project'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create project in database
      const projectId = await createProject(projectData, user.id);
      
      if (projectId) {
        // Successfully created in Supabase
        toast.success(`Project created`, {
          description: `"${projectName}" has been created successfully`
        });
        
        setIsOpen(false);
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
    tasks,
    teamMembers,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addTask,
    updateTask,
    removeTask,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    handleCreateProject
  };
};
