
import { useEffect } from 'react';
import { useProjectForm } from '@/hooks/project-form';
import { useModalState } from './useModalState';
import { useProjectSubmit } from './useProjectSubmit';

// Placeholder for Phase type
interface Phase {
  id: string;
  name: string;
}

// Placeholder for ProjectTask type
interface ProjectTask {
  id: string;
  title: string;
}

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
    resetForm
  } = useProjectForm();

  const { isOpen, setIsOpen, isSubmitting, setIsSubmitting } = useModalState();
  const { handleSubmit } = useProjectSubmit({ onClose: () => setIsOpen(false) });

  useEffect(() => {
    if (isOpen) {
      generateProjectCode();
    }
  }, [isOpen, generateProjectCode]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleCreateProject = (values: any) => {
    return handleSubmit(values);
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
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addTask,
    updateTask,
    removeTask,
    handleCreateProject
  };
};

// Export placeholder types
export type { Phase, ProjectTask };
