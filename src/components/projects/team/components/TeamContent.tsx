
import React from 'react';
import { Loader2, RefreshCw, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamMember } from '../types';
import TeamMemberItem from './TeamMemberItem';

interface TeamContentProps {
  teamMembers: TeamMember[];
  isRefreshing: boolean;
  isRemoving: boolean;
  isUpdating: boolean;
  projectManagerName: string | null;
  refreshTeamMembers: () => void;
  onAddMember: () => void;
  onRemove: (id: string) => Promise<boolean>;
  onMakeManager: (id: string) => Promise<boolean>;
}

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
  if (isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Project Team</h2>
          <p className="text-sm text-muted-foreground">
            {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
            {projectManagerName ? ` · Project Manager: ${projectManagerName}` : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshTeamMembers}
            disabled={isRefreshing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {teamMembers.length > 0 ? (
        <div className="space-y-2">
          {teamMembers.map(member => (
            <TeamMemberItem
              key={member.id}
              member={member}
              projectManagerName={projectManagerName}
              onRemove={onRemove}
              onMakeManager={onMakeManager}
              isRemoving={isRemoving}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No team members added yet</p>
          <Button variant="outline" className="mt-4" onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add First Team Member
          </Button>
        </div>
      )}
    </>
  );
};

export default TeamContent;
