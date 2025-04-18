
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeamMember } from '@/lib/types/common';
import { UserPlus } from 'lucide-react';
import TeamMembersList from '../team/components/TeamMembersList';
import { useTeamMembers } from '../team/hooks/useTeamMembers';

interface TeamSectionProps {
  projectId: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ projectId }) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  
  const { 
    teamMembers,
    isRefreshing,
    isAdding,
    isRemoving,
    isUpdating,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  } = useTeamMembers([], projectId);

  // Find project manager if exists
  const projectManager = teamMembers.find(member => 
    member.role === 'project_manager' || 
    member.role === 'Project Manager'
  );
  
  const projectManagerName = projectManager?.name || null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Members</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAddMemberOpen(true)}
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        {isRefreshing ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No team members yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddMemberOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add your first team member
            </Button>
          </div>
        ) : (
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
              onRemove={handleRemoveMember}
              onMakeManager={assignProjectManager}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamSection;
