
import React from 'react';
import { TeamMember } from '../types';
import TeamMemberAvatar from './TeamMemberAvatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TeamMembersListProps {
  members: TeamMember[];
  maxVisible?: number;
  size?: 'xs' | 'sm' | 'md';
}

/**
 * A reusable component for displaying a horizontal list of team member avatars
 * with tooltip information and a "+X more" indicator for overflowing members
 */
export const TeamMembersList: React.FC<TeamMembersListProps> = ({
  members = [],
  maxVisible = 5,
  size = 'sm'
}) => {
  // Safely ensure members is always an array and not undefined
  const safeMembers = Array.isArray(members) ? members : [];
  
  // Get the visible members to display
  const visibleMembers = safeMembers.slice(0, maxVisible);
  
  // Count of additional members not shown
  const additionalCount = Math.max(0, safeMembers.length - maxVisible);

  if (safeMembers.length === 0) {
    return <div className="text-sm text-muted-foreground">No team members</div>;
  }

  // Size classes for avatar container
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-7 w-7',
    md: 'h-8 w-8'
  };

  return (
    <div className="flex -space-x-2">
      <TooltipProvider>
        {visibleMembers.map((member, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className={`${sizeClasses[size]} border-2 border-background rounded-full overflow-hidden`}>
                <TeamMemberAvatar
                  name={member.name}
                  role={member.role}
                  size={size === 'md' ? 'sm' : 'xs'}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {additionalCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`${sizeClasses[size]} border-2 border-background bg-muted flex items-center justify-center text-xs font-medium rounded-full`}>
                +{additionalCount}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{additionalCount} more team {additionalCount === 1 ? 'member' : 'members'}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default TeamMembersList;
