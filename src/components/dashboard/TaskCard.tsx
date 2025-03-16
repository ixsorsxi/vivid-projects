
import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import TaskCardActions from './task-card/TaskCardActions';
import TaskCardTitle from './task-card/TaskCardTitle';
import TaskBadges from './task-card/TaskBadges';
import TaskDueDate from './task-card/TaskDueDate';
import TaskAssignees from './task-card/TaskAssignees';
import { List, ArrowDownToLine, ArrowUpToLine, Link } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    project?: string;
    assignees: { name: string; avatar?: string }[];
    completed?: boolean;
    subtasks?: any[];
    dependencies?: { taskId: string; type: string }[];
  };
  allTasks?: any[];
  className?: string;
  actions?: React.ReactNode;
  onStatusChange?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard = ({ 
  task, 
  allTasks = [],
  className, 
  actions, 
  onStatusChange, 
  onViewDetails, 
  onEdit, 
  onDelete 
}: TaskCardProps) => {
  const { 
    title, 
    description, 
    status, 
    priority, 
    dueDate, 
    project, 
    assignees, 
    completed,
    subtasks,
    dependencies
  } = task;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const [isChecked, setIsChecked] = React.useState(completed || false);
  
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (onStatusChange) {
      onStatusChange();
    }
  };

  // Count by dependency type
  const blockingCount = dependencies?.filter(dep => dep.type === 'blocking').length || 0;
  const waitingCount = dependencies?.filter(dep => dep.type === 'waiting-on').length || 0;
  const relatedCount = dependencies?.filter(dep => dep.type === 'related').length || 0;
  
  // Subtask count and completion status
  const subtaskCount = subtasks?.length || 0;
  const completedSubtasks = subtasks?.filter(sub => sub.completed).length || 0;
  
  return (
    <div className={cn(
      "glass-card rounded-xl p-4 hover-lift transition-all duration-300",
      isChecked && "opacity-70",
      className
    )}>
      <div className="flex items-start gap-3">
        {/* Wrap checkbox in a div instead of being directly adjacent to potential button */}
        <div className="mt-1">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={handleCheckboxChange}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1 min-w-0">
              <TaskCardTitle 
                title={title} 
                priority={priority} 
                isChecked={isChecked} 
              />
              
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-1">{description}</p>
              )}
            </div>
            
            <TaskCardActions 
              actions={actions} 
              onViewDetails={onViewDetails} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          </div>
          
          <TaskBadges status={status} project={project} />
          
          {/* Show subtasks and dependencies if they exist */}
          {(subtaskCount > 0 || dependencies?.length) && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {subtaskCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <List className="mr-1 h-3.5 w-3.5" />
                        <span>{completedSubtasks}/{subtaskCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {completedSubtasks} of {subtaskCount} subtasks completed
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {dependencies?.length > 0 && (
                <div className="flex items-center gap-2">
                  {blockingCount > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <ArrowUpToLine className="mr-0.5 h-3.5 w-3.5 text-destructive/70" />
                            <span>{blockingCount}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {blockingCount} blocking dependencies
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {waitingCount > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <ArrowDownToLine className="mr-0.5 h-3.5 w-3.5" />
                            <span>{waitingCount}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          Waiting on {waitingCount} tasks
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {relatedCount > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <Link className="mr-0.5 h-3.5 w-3.5 text-primary/70" />
                            <span>{relatedCount}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {relatedCount} related tasks
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <TaskDueDate dueDate={dueDate} formatDate={formatDate} />
            <TaskAssignees assignees={assignees} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
