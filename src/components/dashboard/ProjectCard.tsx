
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    progress: number;
    status: 'not-started' | 'in-progress' | 'on-hold' | 'completed';
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    members: { name: string; avatar?: string }[];
  };
  className?: string;
  onClick?: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'not-started':
      return <Badge variant="outline" size="sm">Not Started</Badge>;
    case 'in-progress':
      return <Badge variant="primary" size="sm">In Progress</Badge>;
    case 'on-hold':
      return <Badge variant="warning" size="sm" dot>On Hold</Badge>;
    case 'completed':
      return <Badge variant="success" size="sm">Completed</Badge>;
    default:
      return null;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'low':
      return <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/20" size="sm">Low</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/20" size="sm">Medium</Badge>;
    case 'high':
      return <Badge className="bg-rose-500/15 text-rose-500 border-rose-500/20" size="sm">High</Badge>;
    default:
      return null;
  }
};

export const ProjectCard = ({ project, className, onClick }: ProjectCardProps) => {
  const { id, name, description, progress, status, dueDate, priority, members } = project;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${id}`);
    }
  };

  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${id}?tab=settings`);
    toast({
      title: "Edit Project",
      description: "Opening project settings...",
    });
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${id}`);
            }}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditProject}>
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
              Archive Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Progress bar */}
      <div className="mt-5 space-y-1">
        <div className="flex justify-between text-xs">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
      
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
          <div className="flex -space-x-2 mr-2">
            <TooltipProvider>
              {members.slice(0, 3).map((member, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div>
                      <Avatar 
                        name={member.name} 
                        src={member.avatar} 
                        size="sm" 
                        className="ring-2 ring-background"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              
              {members.length > 3 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-medium ring-2 ring-background">
                      +{members.length - 3}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{members.slice(3).map(m => m.name).join(', ')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${id}`);
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
