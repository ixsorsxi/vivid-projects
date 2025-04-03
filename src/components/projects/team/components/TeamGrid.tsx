
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
  // Check if any member is already a project manager
  const hasProjectManager = members.some(
    member => member.role === 'Project Manager' || 
              member.role === 'project-manager' || 
              member.role === 'project manager'
  );
  
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">No team members yet</h3>
        <p className="mt-2 text-sm text-gray-400">Add team members to start collaborating</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
