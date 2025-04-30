
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { createProject, ProjectCreateData } from '@/api/projects';

interface UseProjectSubmitProps {
  onClose: () => void;
}

export const useProjectSubmit = ({ onClose }: UseProjectSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (values: any) => createProject({
      name: values.projectName,
      description: values.projectDescription,
      category: values.projectCategory,
      due_date: values.dueDate,
      status: 'not-started',
      progress: 0,
      user_id: values.user_id || ''
    } as ProjectCreateData),
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

    // Create the project with required fields
    const projectData: ProjectCreateData = {
      name: values.projectName,
      description: values.projectDescription,
      category: values.projectCategory,
      due_date: values.dueDate,
      status: 'not-started',
      progress: 0,
      user_id: values.user_id || ''
    };

    const result = await createProject(projectData);

    if (result && result.id) {
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
