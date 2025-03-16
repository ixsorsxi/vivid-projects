
import React from 'react';
import { Task } from '@/lib/data';
import { ArrowDownToLine, ArrowUpToLine, Link } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TaskDependencyIndicatorProps {
  task: Task;
  allTasks: Task[];
}

const TaskDependencyIndicator: React.FC<TaskDependencyIndicatorProps> = ({ task, allTasks }) => {
  if (!task.dependencies || task.dependencies.length === 0) return null;
  
  // Count by type
  const blockingCount = task.dependencies.filter(dep => dep.type === 'blocking').length;
  const waitingCount = task.dependencies.filter(dep => dep.type === 'waiting-on').length;
  const relatedCount = task.dependencies.filter(dep => dep.type === 'related').length;
  
  // Get task names for tooltip
  const getTasksForType = (type: string) => {
    return task.dependencies
      ?.filter(dep => dep.type === type)
      .map(dep => {
        const dependencyTask = allTasks.find(t => t.id === dep.taskId);
        return dependencyTask?.title || 'Unknown task';
      })
      .join(', ');
  };
  
  const blockingTasks = getTasksForType('blocking');
  const waitingTasks = getTasksForType('waiting-on');
  const relatedTasks = getTasksForType('related');
  
  return (
    <div className="flex items-center gap-1.5">
      <TooltipProvider delayDuration={300}>
        {blockingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-0.5",
                "text-destructive/70 hover:text-destructive"
              )}>
                <ArrowUpToLine className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{blockingCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[200px]">
              <p>
                <span className="font-medium">Blocking:</span> {blockingTasks}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {waitingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-0.5",
                "text-muted-foreground hover:text-foreground"
              )}>
                <ArrowDownToLine className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{waitingCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[200px]">
              <p>
                <span className="font-medium">Waiting on:</span> {waitingTasks}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {relatedCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-0.5",
                "text-primary/70 hover:text-primary"
              )}>
                <Link className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{relatedCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[200px]">
              <p>
                <span className="font-medium">Related to:</span> {relatedTasks}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default TaskDependencyIndicator;
