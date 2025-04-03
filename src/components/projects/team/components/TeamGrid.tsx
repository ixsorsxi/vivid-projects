
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
  // Check if any team member is already a project manager
  const hasProjectManager = members.some(member => 
    member.role === 'Project Manager' || 
    member.role === 'project-manager' || 
    member.role === 'project manager'
  );

  if (members.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg mt-4">
        <p className="text-muted-foreground">No team members yet</p>
        <p className="text-xs text-muted-foreground mt-1">Add team members to start collaborating</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {members.map(member => (
        <TeamMemberCard 
          key={member.id} 
          member={member} 
          onRemove={onRemove}
          onMakeManager={onMakeManager}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          isProjectManager={hasProjectManager}
        />
      ))}
    </div>
  );
};

export default TeamGrid;
