
import React from 'react';
import { TeamMember } from '../types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TeamMembersListProps {
  members: TeamMember[];
  maxVisible?: number;
  size?: 'xs' | 'sm' | 'md';
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ 
  members,
  maxVisible = 5,
  size = 'sm'
}) => {
  // Size classes for avatars
  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm'
  };
  
  // Calculate how many to show and if there are extras
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = Math.max(0, members.length - maxVisible);
  
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {visibleMembers.map((member, index) => (
        <Avatar 
          key={member.id || index} 
          className={cn(
            "ring-2 ring-background",
            sizeClasses[size]
          )}
        >
          <AvatarFallback className="bg-primary/10 text-primary">
            {member.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      
      {extraCount > 0 && (
        <Avatar className={cn(
          "ring-2 ring-background bg-muted",
          sizeClasses[size]
        )}>
          <AvatarFallback className="bg-muted text-muted-foreground">
            +{extraCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default TeamMembersList;
