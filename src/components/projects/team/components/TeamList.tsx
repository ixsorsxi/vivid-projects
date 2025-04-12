
import React from 'react';
import TeamMemberItem from './TeamMemberItem';

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
}

interface TeamListProps {
  teamMembers: TeamMember[];
  currentUserId: string | null;
  onRemove: (id: string) => void;
  onMakeManager: (id: string) => void;
  isLoading: boolean;
}

const TeamList: React.FC<TeamListProps> = ({
  teamMembers,
  currentUserId,
  onRemove,
  onMakeManager,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-6">Loading team members...</div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No team members yet. Add team members to collaborate on this project.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teamMembers.map(member => (
        <TeamMemberItem
          key={member.id}
          id={member.id}
          name={member.name}
          role={member.role}
          userId={member.user_id}
          currentUserId={currentUserId}
          onRemove={onRemove}
          onMakeManager={onMakeManager}
        />
      ))}
    </div>
  );
};

export default TeamList;
