
import React from 'react';
import { TeamMember } from '@/api/projects/modules/team/types';
import Avatar from '@/components/ui/avatar.custom';
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
          name={member.name}
          className={cn(
            "ring-2 ring-background",
            sizeClasses[size]
          )}
          showStatus={false}
          size={size}
        />
      ))}
      
      {extraCount > 0 && (
        <div className={cn(
          "ring-2 ring-background bg-muted flex items-center justify-center text-muted-foreground",
          sizeClasses[size],
          "rounded-full"
        )}>
          +{extraCount}
        </div>
      )}
    </div>
  );
};

export default TeamMembersList;
