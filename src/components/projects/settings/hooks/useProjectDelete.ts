
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/toast-wrapper";
import { useNavigate } from "react-router-dom";
import { deleteProjectTasks } from './utils/taskOperations';
import { deleteProjectMembers } from './utils/memberOperations';
import { deleteProjectEntity } from './utils/projectOperations';

interface UseProjectDeleteProps {
  projectId: string;
  onSuccess: () => void;
}

export function useProjectDelete({ projectId, onSuccess }: UseProjectDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const deleteProject = async (confirmText: string): Promise<boolean> => {
    if (confirmText !== "delete") return false;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log("Deleting project with ID:", projectId);
      
      // Step 1: Delete all project-related tasks and their dependencies
      const tasksDeleted = await deleteProjectTasks(projectId);
      if (!tasksDeleted) {
        throw new Error("Failed to delete project tasks");
      }
      
      // Step 2: Delete project members
      const membersDeleted = await deleteProjectMembers(projectId);
      if (!membersDeleted) {
        throw new Error("Failed to delete project members");
      }
      
      // Step 3: Delete the project itself
      const projectDeleted = await deleteProjectEntity(projectId);
      if (!projectDeleted) {
        throw new Error("Failed to delete project");
      }
      
      // Success! Call the onSuccess callback
      onSuccess();
      
      // Show success toast
      toast.success("Project deleted", {
        description: "The project has been successfully deleted."
      });
      
      // Navigate to projects page after a short delay
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
      
      return true;
      
    } catch (err: any) {
      console.error("Error in deleteProject:", err);
      setDeleteError(err.message || "An unexpected error occurred while trying to delete the project.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    deleteError,
    deleteProject,
    setDeleteError
  };
}
