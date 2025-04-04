
import React from 'react';
import { Button } from '@/components/ui/button';
import { TeamMember } from '../types';
import { UserPlus, RefreshCcw } from 'lucide-react';
import TeamMemberCard from '../TeamMemberCard';
import { Card } from '@/components/ui/card';

interface TeamContentProps {
  teamMembers: TeamMember[];
  isRefreshing: boolean;
  isRemoving: boolean;
  isUpdating: boolean;
  projectManagerName: string | null;
  refreshTeamMembers: () => Promise<void>;
  onAddMember: () => void;
  onRemove: (id: string | number) => Promise<boolean>;
  onMakeManager: (id: string | number) => Promise<boolean>;
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
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">Team Members</h3>
          {projectManagerName && (
            <p className="text-sm text-muted-foreground">
              Project Manager: <span className="font-medium">{projectManagerName}</span>
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshTeamMembers}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={onAddMember}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Member
          </Button>
        </div>
      </div>
      
      {teamMembers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No team members have been added to this project yet.</p>
          <p className="text-sm mt-2">Click "Add Member" to add team members to the project.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => (
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
      )}
    </>
  );
};

export default TeamContent;
