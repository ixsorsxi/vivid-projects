
// Fix the toast calls and ProjectCreateResponse type issue
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, updateProject } from '@/api/projects';
import { toast } from '@/components/ui/toast-wrapper';

// Define a proper type for ProjectCreateResponse that includes id
interface ProjectCreateResponse {
  id: string;
  name: string;
  description: string;
  // Add other properties as needed
}

export const useProjectSubmit = (closeModal: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      const name = values.name || 'New Project';
      const description = values.description || '';
      
      toast({
        title: "Creating project",
        description: "Your project is being created..."
      });
      
      const result = await createProject({
        name,
        description
      }) as ProjectCreateResponse;
      
      toast({
        title: "Project created",
        description: `${name} has been created successfully.`
      });
      
      // Navigate to the new project
      navigate(`/projects/${result.id}`);
      closeModal();
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      toast.error("Failed to create project", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateProjectWithTeam = async (
    projectName: string,
    projectDescription: string,
    teamMembers: string[],
    startDate?: string
  ) => {
    setIsSubmitting(true);
    
    try {
      toast({
        title: "Creating project",
        description: "Your project with team is being created..."
      });
      
      // Create the project first
      const result = await createProject({
        name: projectName,
        description: projectDescription,
      }) as ProjectCreateResponse;
      
      toast({
        title: "Project created",
        description: `${projectName} has been created successfully.`
      });
      
      // Navigate to the new project
      navigate(`/projects/${result.id}`);
      closeModal();
    } catch (error: any) {
      console.error('Error creating project with team:', error);
      
      toast.error("Failed to create project", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
