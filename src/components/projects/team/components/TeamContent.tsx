
import React from 'react';
import { TeamMember } from '../types';
import TeamGrid from './TeamGrid';
import TeamHeader from './TeamHeader';

interface TeamContentProps {
  teamMembers: TeamMember[];
  isRefreshing: boolean;
  isRemoving: boolean;
  isUpdating: boolean;
  projectManagerName: string | null;
  refreshTeamMembers: () => Promise<void>;
  onAddMember: () => void;
  onRemove?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
}

/**
 * Main content component for displaying the team members
 */
const TeamContent: React.FC<TeamContentProps> = ({
  teamMembers,
  isRefreshing,
  isRemoving,
  isUpdating,
  projectManagerName,
  refreshTeamMembers,
  onAddMember,
  onRemove,
  onMakeManager
}) => {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="space-y-6">
        <TeamHeader
          memberCount={0}
          isRefreshing={isRefreshing}
          onRefresh={refreshTeamMembers}
          onAddMember={onAddMember}
          projectManagerName={projectManagerName}
        />
        
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-500">No team members yet</h3>
          <p className="mt-2 text-sm text-gray-400">Add team members to start collaborating</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeamHeader
        memberCount={teamMembers.length}
        isRefreshing={isRefreshing}
        onRefresh={refreshTeamMembers}
        onAddMember={onAddMember}
        projectManagerName={projectManagerName}
      />
      
      <TeamGrid
        members={teamMembers}
        onRemove={onRemove}
        onMakeManager={onMakeManager}
        isRemoving={isRemoving}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default TeamContent;
