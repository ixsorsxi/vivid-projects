
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { ProjectCardProps } from './types/project-card.types';
import { getStatusBadge, getPriorityBadge, formatDate } from './utils/project-card-helpers';
import ProjectCardActions from './ProjectCardActions';
import ProjectCardMembers from './ProjectCardMembers';
import ProjectProgressBar from './ProjectProgressBar';

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
  
  return (
    <div 
      className={cn("glass-card rounded-xl p-5 hover-lift", onClick && "cursor-pointer", className)}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </div>
        
        <ProjectCardActions projectId={id} projectName={name} />
      </div>
      
      {/* Progress bar */}
      <ProjectProgressBar progress={progress} />
      
      {/* Badges */}
      <div className="flex items-center gap-2 mt-4">
        {getStatusBadge(status)}
        {getPriorityBadge(priority)}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>Due {formatDate(dueDate)}</span>
        </div>
        
        <div className="flex items-center">
          <ProjectCardMembers members={members} />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleViewDetails}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
