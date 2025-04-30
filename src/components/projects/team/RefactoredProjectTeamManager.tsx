
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useTeamData } from './hooks/useTeamData';
import TeamDialogs from './components/TeamDialogs';
import TeamMembersList from './components/TeamMembersList';
import { useTeamOperations } from './hooks/team-operations/useTeamOperations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectTeamManagerProps {
  projectId: string;
}

const RefactoredProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({
  projectId
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { members, isLoading, error } = useTeamData(projectId);
  const [teamMembers, setTeamMembers] = useState(members);
  
  useEffect(() => {
    setTeamMembers(members);
  }, [members]);
  
  const { 
    isAdding,
    isRemoving,
    isUpdating,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  } = useTeamOperations(teamMembers, setTeamMembers, projectId);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle>Team</CardTitle>
        <Button 
          onClick={() => setIsAddMemberOpen(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="spinner"></div>
          </div>
        ) : teamMembers.length > 0 ? (
          <TeamMembersList 
            members={teamMembers}
            isRemoving={isRemoving}
            isUpdating={isUpdating}
            onRemove={handleRemoveMember}
            onMakeManager={assignProjectManager}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No team members yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddMemberOpen(true)}
              className="mt-2"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add your first team member
            </Button>
          </div>
        )}
      </CardContent>
      
      <TeamDialogs
        isAddMemberOpen={isAddMemberOpen}
        setIsAddMemberOpen={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={handleAddMember}
        isAddingMember={isAdding}
      />
    </Card>
  );
};

export default RefactoredProjectTeamManager;
