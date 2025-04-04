
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Calendar, Clock, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/toast-wrapper';

import { ProjectCardProps } from './types/project-card.types';
import { getStatusBadge, getPriorityBadge, formatDate } from './utils/project-card-helpers';
import ProjectCardMembers from './ProjectCardMembers';
import ProjectProgressBar from './ProjectProgressBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ProjectCard = ({ project, className, onClick }: ProjectCardProps) => {
  const { id, name, description, progress, status, dueDate, priority, members } = project;
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${id}`);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${id}`);
  };
  
  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${id}?tab=settings`);
    toast("Edit Project", {
      description: "Opening project settings...",
    });
  };
  
  const handleDeleteProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.error("Delete Project", {
      description: `Project "${name}" will be deleted. This action is not reversible.`,
    });
    // In a real app, this would make an API call to delete the project
  };
  
  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-5 hover-lift transition-all border-l-4",
        status === 'completed' ? "border-l-green-500" :
        status === 'in-progress' ? "border-l-blue-500" :
        status === 'on-hold' ? "border-l-amber-500" :
        "border-l-slate-400",
        onClick && "cursor-pointer", 
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 hover:opacity-100" onClick={(e) => e.stopPropagation()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditProject}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteProject} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Progress bar with enhanced styling */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <ProjectProgressBar progress={progress} />
      </div>
      
      {/* Badges with improved styling */}
      <div className="flex items-center gap-2 mt-4">
        {getStatusBadge(status)}
        {getPriorityBadge(priority)}
      </div>
      
      {/* Footer with enhanced styling */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Due {formatDate(dueDate)}</span>
        </div>
        
        <div className="flex items-center">
          <ProjectCardMembers members={members} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
