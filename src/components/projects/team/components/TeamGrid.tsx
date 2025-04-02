
import React from 'react';
import { TeamMember } from '../types';
import TeamMemberCard from '../TeamMemberCard';

interface TeamGridProps {
  members: TeamMember[];
  onRemove: (id: string | number) => void;
  isRemoving: string | null;
}

const TeamGrid: React.FC<TeamGridProps> = ({ members, onRemove, isRemoving }) => {
  // Debug the members data
  console.log('TeamGrid rendering with members:', members);

  if (!members || members.length === 0) {
    return (
      <div className="col-span-2 p-6 text-center border rounded-lg">
        <p className="text-muted-foreground">No team members yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {members.map(member => (
        <TeamMemberCard 
          key={member.id.toString()} 
          member={member} 
          onRemove={onRemove}
          isRemoving={isRemoving === member.id.toString()}
        />
      ))}
    </div>
  );
};

export default TeamGrid;
