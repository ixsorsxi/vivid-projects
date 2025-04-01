import { useEffect } from 'react';
import { useProjectForm } from '@/hooks/project-form';
import { useModalState } from './useModalState';
import { useProjectSubmit } from './useProjectSubmit';

export const useNewProjectModal = () => {
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

  const { isOpen, setIsOpen, isSubmitting, setIsSubmitting } = useModalState();

  // Form data object for submission
  const formData = {
    projectName,
    projectDescription,
    projectCategory,
    projectType: projectCategory, // Use projectCategory as the projectType for backward compatibility
    dueDate,
    isPrivate,
    projectCode,
    budget,
    currency,
    phases,
    tasks,
    teamMembers
  };

  const { handleCreateProject } = useProjectSubmit(
    formData,
    setIsSubmitting,
    setIsOpen,
    resetForm
  );

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

// Re-export types
export * from './types';
