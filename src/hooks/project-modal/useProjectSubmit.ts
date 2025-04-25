import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { createProject, ProjectCreateParams } from '@/api/projects';
import { Phase } from '@/lib/types/project';
import { ProjectTask } from '@/components/projects/types';

interface UseProjectSubmitProps {
  onClose: () => void;
}

export const useProjectSubmit = ({ onClose }: UseProjectSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (values: any) => createProject(values),
    onSuccess: (result, values) => {
      setIsSubmitting(false);
      toast({
        title: "Project created",
        description: `The project ${values.projectName} has been created successfully.`,
      });
      onClose();
      navigate(`/projects/${result.id}`);
    },
    onError: (error: any, values) => {
      setIsSubmitting(false);
      toast.error("Error", {
        description: `Failed to create project ${values.projectName}. ${error.message}`,
      });
    },
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    // Modify the createProject call to match the expected parameters
    const result = await createProject({
      name: values.projectName,
      description: values.projectDescription,
      teamMembers: values.teamMembers,
      dueDate: values.dueDate,
      // Add all other properties from values
      category: values.projectCategory,
      isPrivate: values.isPrivate,
      projectCode: values.projectCode,
      budget: values.budget,
      currency: values.currency,
      phases: values.phases,
      tasks: values.tasks,
      projectType: values.projectType
    });

    if (result) {
      setIsSubmitting(false);
      toast({
        title: "Project created",
        description: `The project ${values.projectName} has been created successfully.`,
      });
      onClose();
      navigate(`/projects/${result.id}`);
    } else {
      setIsSubmitting(false);
      toast.error("Error", {
        description: `Failed to create project ${values.projectName}.`,
      });
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
