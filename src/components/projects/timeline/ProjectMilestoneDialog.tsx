
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectMilestone } from '@/lib/types/project';

export interface ProjectMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  milestone?: ProjectMilestone;
  isEditing?: boolean;
  onAddMilestone: (milestone: Omit<ProjectMilestone, "id" | "created_at" | "project_id">) => Promise<void>;
}

const ProjectMilestoneDialog: React.FC<ProjectMilestoneDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  milestone,
  isEditing = false,
  onAddMilestone
}) => {
  // This is just a placeholder implementation
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
        </DialogHeader>
        <div>
          {/* Milestone form would go here */}
          <p>Milestone dialog content placeholder</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMilestoneDialog;
