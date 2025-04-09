
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { TeamMember } from '../types';
import TeamMembersList from './TeamMembersList';
import { EmptyState } from '@/components/ui/empty-state';

interface TeamContentProps {
  teamMembers: TeamMember[];
  projectManagerName: string | null;
  isRefreshing: boolean;
  isRemoving: boolean;
  isUpdating: boolean;
  refreshTeamMembers: () => Promise<void>;
  onAddMember: () => void;
  onRemove: (id: string) => Promise<boolean>;
  onMakeManager: (id: string) => Promise<boolean>;
}

const TeamContent: React.FC<TeamContentProps> = ({
  teamMembers,
  projectManagerName,
  isRefreshing,
  isRemoving,
  isUpdating,
  refreshTeamMembers,
  onAddMember,
  onRemove,
  onMakeManager
}) => {
  if (isRefreshing) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <EmptyState
        title="No team members yet"
        description="Add team members to collaborate on this project"
        action={
          <Button onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {projectManagerName && (
        <div className="text-sm">
          <span className="font-medium">Project Manager:</span>{' '}
          <span className="text-primary">{projectManagerName}</span>
        </div>
      )}
      
      <TeamMembersList 
        members={teamMembers}
        isRemoving={isRemoving}
        isUpdating={isUpdating}
        onRemove={onRemove}
        onMakeManager={onMakeManager}
      />
    </div>
  );
};

export default TeamContent;
