
import React from 'react';
import { Avatar } from '@/components/ui/avatar.custom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Assignee {
  name: string;
  avatar?: string;
}

interface TaskAssigneesProps {
  assignees: Assignee[];
  className?: string;
  limit?: number;
}

const TaskAssignees: React.FC<TaskAssigneesProps> = ({ 
  assignees, 
  className = "",
  limit = 3 
}) => {
  // Ensure we have an array of assignees, even if assignees is undefined
  const safeAssignees = assignees || [];
  
  if (safeAssignees.length === 0) return null;
  
  return (
    <div className={`flex -space-x-2 ${className}`}>
      <TooltipProvider delayDuration={300}>
        {safeAssignees.slice(0, limit).map((assignee, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className="transition-transform hover:translate-y-[-2px]">
                <Avatar 
                  name={assignee.name} 
                  src={assignee.avatar} 
                  size="xs" 
                  className="ring-2 ring-background shadow-sm"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-background/95 backdrop-blur-sm border shadow-lg">
              <p className="text-xs font-medium">{assignee.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {safeAssignees.length > limit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-medium ring-2 ring-background shadow-sm transition-transform hover:translate-y-[-2px]">
                +{safeAssignees.length - limit}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-background/95 backdrop-blur-sm border shadow-lg">
              <p className="text-xs font-medium">{safeAssignees.length - limit} more assignees</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default TaskAssignees;
