
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: 'to-do' | 'in-progress' | 'in-review' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    project?: string;
    assignees: { name: string; avatar?: string }[];
    completed?: boolean;
  };
  className?: string;
  actions?: React.ReactNode;
}

const getPriorityIndicator = (priority: string) => {
  switch (priority) {
    case 'low':
      return <span className="h-2 w-2 rounded-full bg-blue-500" />;
    case 'medium':
      return <span className="h-2 w-2 rounded-full bg-amber-500" />;
    case 'high':
      return <span className="h-2 w-2 rounded-full bg-rose-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'to-do':
      return <Badge variant="outline" size="sm">To Do</Badge>;
    case 'in-progress':
      return <Badge variant="primary" size="sm">In Progress</Badge>;
    case 'in-review':
      return <Badge className="bg-purple-500/15 text-purple-500 border-purple-500/20" size="sm">In Review</Badge>;
    case 'completed':
      return <Badge variant="success" size="sm">Completed</Badge>;
    default:
      return null;
  }
};

export const TaskCard = ({ task, className, actions }: TaskCardProps) => {
  const { title, description, status, priority, dueDate, project, assignees, completed } = task;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const [isChecked, setIsChecked] = React.useState(completed || false);
  
  return (
    <div className={cn(
      "glass-card rounded-xl p-4 hover-lift transition-all duration-300",
      isChecked && "opacity-70",
      className
    )}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={isChecked} 
          onCheckedChange={() => setIsChecked(!isChecked)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                {getPriorityIndicator(priority)}
                <h3 className={cn(
                  "font-medium text-base line-clamp-1",
                  isChecked && "line-through text-muted-foreground"
                )}>
                  {title}
                </h3>
              </div>
              
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-1">{description}</p>
              )}
            </div>
            
            {actions ? (
              actions
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {getStatusBadge(status)}
            
            {project && (
              <Badge variant="outline" size="sm" className="bg-background/50">
                {project}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            {dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Due {formatDate(dueDate)}</span>
              </div>
            )}
            
            {assignees.length > 0 && (
              <div className="flex -space-x-2">
                {assignees.slice(0, 3).map((assignee, index) => (
                  <Avatar 
                    key={index}
                    name={assignee.name} 
                    src={assignee.avatar} 
                    size="xs" 
                    className="ring-2 ring-background"
                  />
                ))}
                
                {assignees.length > 3 && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium ring-2 ring-background">
                    +{assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
