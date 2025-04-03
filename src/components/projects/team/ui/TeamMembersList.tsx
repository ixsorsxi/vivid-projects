
import React from 'react';
import { TeamMember } from '../types';
import TeamMemberCard from '../TeamMemberCard';

interface TeamMembersListProps {
  members: TeamMember[];
  onRemove?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
  isRemoving?: boolean;
  isUpdating?: boolean;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({
  members,
  onRemove,
  onMakeManager,
  isRemoving = false,
  isUpdating = false
}) => {
  // If no members, show empty state
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-muted-foreground">No team members yet</p>
        <p className="text-sm text-muted-foreground mt-2">Add team members to start collaborating</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <TeamMemberCard
          key={member.id}
          member={member}
          onRemove={onRemove}
          onMakeManager={onMakeManager}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          isProjectManager={member.role === 'Project Manager'}
        />
      ))}
    </div>
  );
};

export default TeamMembersList;
