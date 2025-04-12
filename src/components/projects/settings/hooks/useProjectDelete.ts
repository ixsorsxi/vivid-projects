
import { useState } from 'react';
import { toast } from "@/components/ui/toast-wrapper";
import { useNavigate } from "react-router-dom";
import { useServerSideProjectDelete } from './utils/projectOperations';

interface UseProjectDeleteProps {
  projectId: string;
  onSuccess?: () => void;
}

export function useProjectDelete({ projectId, onSuccess }: UseProjectDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  
  const openDeleteDialog = () => {
    setShowConfirmDialog(true);
  };
  
  const deleteProject = async (confirmText: string): Promise<boolean> => {
    if (confirmText !== "delete") return false;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log("Deleting project with ID:", projectId);
      
      // Use the server-side delete function that handles all cascading deletes
      const success = await useServerSideProjectDelete(projectId);
      
      if (!success) {
        throw new Error("Failed to delete project. The server-side operation was unsuccessful.");
      }
      
      // Success! Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Show success toast
      toast.success("Project deleted", {
        description: "The project has been successfully deleted."
      });
      
      // Navigate to projects page after a short delay
      setTimeout(() => {
        navigate('/projects');
        setShowConfirmDialog(false);
      }, 1000);
      
      return true;
      
    } catch (err: any) {
      console.error("Error in deleteProject:", err);
      setDeleteError(err.message || "An unexpected error occurred while trying to delete the project.");
      setShowErrorDialog(true);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    deleteError,
    deleteProject,
    setDeleteError,
    showConfirmDialog,
    setShowConfirmDialog,
    showErrorDialog,
    setShowErrorDialog,
    openDeleteDialog
  };
}
