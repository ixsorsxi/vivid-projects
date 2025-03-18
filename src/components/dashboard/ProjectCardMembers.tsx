
import React from 'react';
import Avatar from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MemberType {
  id?: string;
  name: string;
  avatar?: string;
}

interface ProjectCardMembersProps {
  members?: MemberType[];
  maxVisible?: number;
}

const ProjectCardMembers: React.FC<ProjectCardMembersProps> = ({ 
  members = [], 
  maxVisible = 3 
}) => {
  // Safely ensure members is always an array
  const safeMembers = Array.isArray(members) ? members : [];
  
  // Get the visible members to display
  const visibleMembers = safeMembers.slice(0, maxVisible);
  
  // Count of additional members not shown
  const additionalCount = Math.max(0, safeMembers.length - maxVisible);
  
  if (safeMembers.length === 0) {
    return null;
  }
  
  return (
    <div className="flex -space-x-2 mr-2">
      <TooltipProvider>
        {visibleMembers.map((member, index) => (
          <Tooltip key={member.id || index}>
            <TooltipTrigger asChild>
              <div className="h-7 w-7 border-2 border-background">
                <Avatar 
                  name={member.name}
                  src={member.avatar}
                  size="xs"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{member.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {additionalCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-7 w-7 border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                +{additionalCount}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{additionalCount} more team members</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default ProjectCardMembers;
