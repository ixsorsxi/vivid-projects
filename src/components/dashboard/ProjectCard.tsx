
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
import { motion } from 'framer-motion';

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
  
  const statusColors = {
    'completed': 'border-l-emerald-500 bg-gradient-to-br from-emerald-50/40 to-transparent',
    'in-progress': 'border-l-blue-500 bg-gradient-to-br from-blue-50/40 to-transparent',
    'on-hold': 'border-l-amber-500 bg-gradient-to-br from-amber-50/40 to-transparent',
    'not-started': 'border-l-slate-400 bg-gradient-to-br from-slate-50/40 to-transparent'
  };
  
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors['not-started'];
  
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' 
      }}
      transition={{ 
        duration: 0.2 
      }}
      className={cn(
        "rounded-xl p-5 hover-lift transition-all border-l-4 shadow-sm bg-card/95 backdrop-blur-sm",
        statusColor,
        onClick && "cursor-pointer", 
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 hover:opacity-100 rounded-full" onClick={(e) => e.stopPropagation()}>
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
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditProject} className="cursor-pointer">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteProject} className="text-destructive cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Progress bar with enhanced styling */}
      <div className="mt-5">
        <div className="flex justify-between items-center mb-1.5">
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
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span>Due {formatDate(dueDate)}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <ProjectCardMembers members={members} />
          
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" onClick={handleViewDetails}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
