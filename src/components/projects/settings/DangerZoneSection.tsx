
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SettingsCard from "@/pages/Admin/settings/components/SettingsCard";
import { Separator } from "@/components/ui/separator";
import DeleteProjectDialog from './components/DeleteProjectDialog';
import DeleteErrorDialog from './components/DeleteErrorDialog';
import { useProjectDelete } from './hooks/useProjectDelete';

interface DangerZoneProps {
  projectId: string;
  onDeleteProject: () => void;
}

const DangerZoneSection: React.FC<DangerZoneProps> = ({
  projectId,
  onDeleteProject
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const { 
    isDeleting, 
    deleteError, 
    deleteProject,
    setDeleteError
  } = useProjectDelete({
    projectId,
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      onDeleteProject();
    }
  });
  
  const handleProjectDelete = async (confirmText: string) => {
    const success = await deleteProject(confirmText);
    
    if (!success && deleteError) {
      setIsAlertOpen(true);
    }
  };
  
  return (
    <SettingsCard 
      title="Danger Zone"
      description="Actions that can't be undone"
      onSave={() => {}}
      footer={null}
    >
      <div className="space-y-4">
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-500 dark:text-red-400">Delete Project</p>
            <p className="text-sm text-muted-foreground">
              Once deleted, it's gone forever and cannot be recovered.
            </p>
          </div>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Project
          </Button>
        </div>
      </div>

      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleProjectDelete}
        isDeleting={isDeleting}
      />

      <DeleteErrorDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        errorMessage={deleteError}
      />
    </SettingsCard>
  );
};

export default DangerZoneSection;
