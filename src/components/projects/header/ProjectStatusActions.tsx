
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { toast } from "@/components/ui/toast-wrapper";

interface ProjectStatusActionsProps {
  projectStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

const ProjectStatusActions: React.FC<ProjectStatusActionsProps> = ({
  projectStatus,
  onStatusChange
}) => {
  const handleMarkComplete = () => {
    const newStatus = projectStatus === 'completed' ? 'in-progress' : 'completed';
    
    // Call the passed onStatusChange function if provided
    if (onStatusChange) {
      onStatusChange(newStatus);
    } else {
      // Fallback if no handler is provided
      toast("Project status updated", {
        description: `Project has been marked as ${newStatus === 'completed' ? 'complete' : 'in progress'}`,
      });
    }
  };

  return (
    <Button 
      variant={projectStatus === 'completed' ? 'outline' : 'default'} 
      size="sm" 
      onClick={handleMarkComplete}
    >
      <CheckCircle className="mr-2 h-4 w-4" />
      {projectStatus === 'completed' ? 'Mark In Progress' : 'Mark Complete'}
    </Button>
  );
};

export default ProjectStatusActions;
