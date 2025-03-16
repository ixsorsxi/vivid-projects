
import React from 'react';
import { List, ArrowDownToLine, ArrowUpToLine, Link } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SubtaskProps, DependencyProps } from '../types/task-card.types';

interface TaskMetadataIndicatorsProps extends SubtaskProps, DependencyProps {}

const TaskMetadataIndicators: React.FC<TaskMetadataIndicatorsProps> = ({ 
  subtasks = [], 
  dependencies = [] 
}) => {
  // Count by dependency type
  const blockingCount = dependencies?.filter(dep => dep.type === 'blocking').length || 0;
  const waitingCount = dependencies?.filter(dep => dep.type === 'waiting-on').length || 0;
  const relatedCount = dependencies?.filter(dep => dep.type === 'related').length || 0;
  
  // Subtask count and completion status
  const subtaskCount = subtasks?.length || 0;
  const completedSubtasks = subtasks?.filter(sub => sub.completed).length || 0;

  return (
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
  );
};

export default TaskMetadataIndicators;
