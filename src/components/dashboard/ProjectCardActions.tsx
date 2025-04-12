
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectDelete } from '@/components/projects/settings/hooks/useProjectDelete';
import DeleteConfirmDialog from '@/components/projects/settings/components/DeleteConfirmDialog';
import DeleteErrorDialog from '@/components/projects/settings/components/DeleteErrorDialog';

interface ProjectCardActionsProps {
  projectId: string;
  projectName: string;
  refetchProjects?: () => void;
}

export const ProjectCardActions = ({ projectId, projectName, refetchProjects }: ProjectCardActionsProps) => {
  const navigate = useNavigate();
  const { 
    isDeleting, 
    deleteError, 
    deleteProject, 
    showConfirmDialog, 
    setShowConfirmDialog,
    showErrorDialog,
    setShowErrorDialog,
    openDeleteDialog
  } = useProjectDelete({ 
    projectId, 
    refetchProjects,
    onSuccess: () => {
      // This will be called after successful deletion
      // No need to do anything here as navigation is handled in the hook
    }
  });

  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}?tab=settings`);
    toast("Edit Project", {
      description: "Opening project settings...",
    });
  };
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}`);
  };
  
  const handleDeleteProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteDialog();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditProject}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteProject} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Confirmation Dialog */}
      <DeleteConfirmDialog 
        isOpen={showConfirmDialog}
        projectName={projectName}
        onOpenChange={setShowConfirmDialog}
        onConfirmDelete={deleteProject}
        isDeleting={isDeleting}
      />
      
      {/* Error Dialog */}
      <DeleteErrorDialog
        isOpen={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorMessage={deleteError}
      />
    </>
  );
};

export default ProjectCardActions;
