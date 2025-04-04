
import React from 'react';
import { TeamMember } from '../types';
import TeamMemberCard from '../TeamMemberCard';

interface TeamGridProps {
  teamMembers: TeamMember[];
  projectManagerName?: string | null;
  isRemoving?: boolean;
  isUpdating?: boolean;
  onRemove: (id: string | number) => Promise<boolean>;
  onMakeManager: (id: string | number) => Promise<boolean>;
}

const TeamGrid: React.FC<TeamGridProps> = ({
  teamMembers,
  projectManagerName,
  isRemoving = false,
  isUpdating = false,
  onRemove,
  onMakeManager
}) => {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg">
        <p>No team members have been added yet.</p>
        <p className="text-sm mt-2">Select users from the tabs above to add them to this project.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {teamMembers.map(member => (
        <TeamMemberCard
          key={member.id}
          member={member}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          projectManagerName={projectManagerName}
          onRemove={(id) => onRemove(id)}
          onMakeManager={(id) => onMakeManager(id)}
        />
      ))}
    </div>
  );
};

export default TeamGrid;
