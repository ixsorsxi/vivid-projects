
import React from 'react';
import { TeamMember } from '../types';
import TeamHeader from './TeamHeader';
import TeamGrid from './TeamGrid';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamContentProps {
  teamMembers: TeamMember[];
  isRefreshing?: boolean;
  isRemoving?: boolean;
  isUpdating?: boolean;
  projectManagerName?: string | null;
  refreshTeamMembers: () => Promise<void>;
  onAddMember: () => void;
  onRemove: (id: string | number) => Promise<boolean>;
  onMakeManager: (id: string | number) => Promise<boolean>;
}

const TeamContent: React.FC<TeamContentProps> = ({
  teamMembers,
  isRefreshing = false,
  isRemoving = false,
  isUpdating = false,
  projectManagerName,
  refreshTeamMembers,
  onAddMember,
  onRemove,
  onMakeManager
}) => {
  const hasMembers = teamMembers && teamMembers.length > 0;
  
  return (
    <div className="space-y-6">
      <TeamHeader 
        membersCount={teamMembers?.length || 0}
        isRefreshing={isRefreshing}
        onRefresh={refreshTeamMembers}
        onAddMember={onAddMember}
      />
      
      {hasMembers ? (
        <TeamGrid
          teamMembers={teamMembers}
          projectManagerName={projectManagerName}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          onRemove={onRemove}
          onMakeManager={onMakeManager}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-800">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No team members yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Add team members to start collaborating
            </p>
            <Button 
              onClick={onAddMember}
              className="flex items-center mx-auto gap-2 bg-blue-500 hover:bg-blue-600"
            >
              <UserPlus className="h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamContent;
