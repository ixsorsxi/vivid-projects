
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardActionsProps {
  projectId: string;
  projectName: string;
}

export const ProjectCardActions = ({ projectId, projectName }: ProjectCardActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}?tab=settings`);
    toast({
      title: "Edit Project",
      description: "Opening project settings...",
    });
  };
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}`);
  };
  
  const handleArchiveProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Project archived",
      description: `Project "${projectName}" has been archived.`,
      variant: "destructive",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewDetails}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditProject}>
          Edit Project
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleArchiveProject} className="text-destructive">
          Archive Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectCardActions;
