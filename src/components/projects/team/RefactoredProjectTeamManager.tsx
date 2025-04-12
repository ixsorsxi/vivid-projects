
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import useTeamData from './hooks/useTeamData';
import useTeamOperations from './hooks/useTeamOperations';
import TeamHeader from './components/TeamHeader';
import TeamList from './components/TeamList';
import AddMemberDialog from './add-member/AddMemberDialog';

interface ProjectTeamManagerProps {
  projectId: string;
}

const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({ projectId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { teamMembers, isLoading, currentUser, fetchTeamMembers } = useTeamData(projectId);
  const { isProcessing, handleRemoveMember, handleMakeManager } = useTeamOperations(projectId, fetchTeamMembers);

  return (
    <Card>
      <TeamHeader onAddMember={() => setIsAddDialogOpen(true)} />
      <CardContent>
        <TeamList 
          teamMembers={teamMembers}
          currentUserId={currentUser}
          onRemove={handleRemoveMember}
          onMakeManager={handleMakeManager}
          isLoading={isLoading || isProcessing}
        />
      </CardContent>

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        projectId={projectId}
        onAddSuccess={fetchTeamMembers}
      />
    </Card>
  );
};

export default ProjectTeamManager;
