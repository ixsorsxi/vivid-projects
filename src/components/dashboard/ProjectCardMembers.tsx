
import React from 'react';
import Avatar from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Member {
  name: string;
  avatar?: string;
}

interface ProjectCardMembersProps {
  members: Member[];
}

export const ProjectCardMembers = ({ members }: ProjectCardMembersProps) => {
  return (
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
  );
};

export default ProjectCardMembers;
