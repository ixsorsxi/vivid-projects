
import React from 'react';
import { Task } from '@/lib/types/task';
import { DependencyType } from '@/lib/types/common';
import { ArrowDownToLine, ArrowUpToLine, Link, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TaskDependencyIndicatorProps {
  task: Task;
  allTasks: Task[];
  showWarnings?: boolean;
}

const TaskDependencyIndicator: React.FC<TaskDependencyIndicatorProps> = ({ 
  task, 
  allTasks,
  showWarnings = true
}) => {
  if (!task.dependencies || task.dependencies.length === 0) return null;
  
  // Count by type
  const blockingCount = task.dependencies.filter(dep => 
    dep.type === 'blocking' || dep.type === 'blocks'
  ).length;
  
  const waitingCount = task.dependencies.filter(dep => 
    dep.type === 'waiting-on' || dep.type === 'is-blocked-by'
  ).length;
  
  const relatedCount = task.dependencies.filter(dep => 
    dep.type === 'related' || dep.type === 'relates-to' || dep.type === 'duplicates'
  ).length;
  
  // Get task names for tooltip
  const getTasksForTypes = (types: DependencyType[]) => {
    return task.dependencies
      ?.filter(dep => types.includes(dep.type as DependencyType))
      .map(dep => {
        const dependencyTask = allTasks.find(t => t.id === dep.taskId);
        return {
          title: dependencyTask?.title || 'Unknown task',
          completed: dependencyTask?.completed || false,
          id: dep.taskId
        };
      });
  };
  
  const blockingTasks = getTasksForTypes(['blocking', 'blocks']);
  const waitingTasks = getTasksForTypes(['waiting-on', 'is-blocked-by']);
  const relatedTasks = getTasksForTypes(['related', 'relates-to', 'duplicates']);
  
  // Check if there are any blocking tasks that are not completed
  const hasBlockingIncomplete = blockingTasks.some(t => !t.completed);
  
  return (
    <div className="flex items-center gap-1.5">
      <TooltipProvider delayDuration={300}>
        {blockingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-0.5",
                hasBlockingIncomplete ? "text-destructive" : "text-destructive/70 hover:text-destructive"
              )}>
                <ArrowUpToLine className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{blockingCount}</span>
                {showWarnings && hasBlockingIncomplete && (
                  <AlertTriangle className="h-3 w-3 ml-0.5" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-[300px] p-2">
              <p className="font-medium mb-1">Blocking Tasks:</p>
              <ul className="space-y-1">
                {blockingTasks.map(task => (
                  <li key={task.id} className="flex items-center gap-1">
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {task.title}
                    </span>
                    {!task.completed && showWarnings && (
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    )}
                  </li>
                ))}
              </ul>
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
            <TooltipContent side="bottom" className="text-xs max-w-[300px] p-2">
              <p className="font-medium mb-1">Waiting on:</p>
              <ul className="space-y-1">
                {waitingTasks.map(task => (
                  <li key={task.id} className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </li>
                ))}
              </ul>
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
            <TooltipContent side="bottom" className="text-xs max-w-[300px] p-2">
              <p className="font-medium mb-1">Related to:</p>
              <ul className="space-y-1">
                {relatedTasks.map(task => (
                  <li key={task.id} className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default TaskDependencyIndicator;
