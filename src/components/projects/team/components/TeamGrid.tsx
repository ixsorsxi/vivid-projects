
import React from 'react';
import { TeamMember } from '../types';
import TeamMemberCard from '../TeamMemberCard';

interface TeamGridProps {
  members: TeamMember[];
  onRemove?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
  isRemoving?: boolean;
  isUpdating?: boolean;
}

const TeamGrid: React.FC<TeamGridProps> = ({
  members,
  onRemove,
  onMakeManager,
  isRemoving = false,
  isUpdating = false
}) => {
  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl text-muted-foreground mb-2">No team members yet</h3>
        <p className="text-sm text-muted-foreground">Add team members to start collaborating</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {members.map((member) => (
        <TeamMemberCard
          key={member.id}
          member={member}
          onRemove={onRemove}
          onMakeManager={onMakeManager}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};

export default TeamGrid;
