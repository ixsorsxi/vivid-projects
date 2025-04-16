
import React from 'react';
import { Avatar } from '@/components/ui/avatar.custom';
import { TeamMember } from '@/lib/types/common';

interface TeamMembersListProps {
  teamMembers: TeamMember[];
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ teamMembers }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {teamMembers.map((member) => (
        <div 
          key={member.id} 
          className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
        >
          <Avatar name={member.name} size="xs" />
          <span className="text-sm font-medium">{member.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
