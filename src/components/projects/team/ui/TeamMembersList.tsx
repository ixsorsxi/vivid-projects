
import React from 'react';
import { TeamMember } from '../types';
import { TeamMemberAvatar } from './index';

interface TeamMembersListProps {
  members: TeamMember[];
  maxVisible?: number;
  size?: 'xs' | 'sm' | 'md';
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ 
  members = [], 
  maxVisible = 5,
  size = 'md'
}) => {
  // Ensure we have valid members array
  const validMembers = Array.isArray(members) ? members : [];
  
  if (validMembers.length === 0) {
    return null;
  }
  
  // Determine how many to show and if we need a +X more indicator
  const visibleMembers = validMembers.slice(0, maxVisible);
  const remainingCount = validMembers.length - visibleMembers.length;
  
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {visibleMembers.map((member, index) => (
        <div key={member.id || index} className="relative">
          <TeamMemberAvatar 
            name={member.name} 
            size={size === 'xs' ? 'sm' : size}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className={`relative flex items-center justify-center bg-muted text-muted-foreground rounded-full ${
          size === 'xs' ? 'h-6 w-6 text-xs' : 
          size === 'sm' ? 'h-8 w-8 text-sm' : 
          'h-10 w-10 text-sm'
        }`}>
          <span>+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

export default TeamMembersList;
