
import React, { useState } from 'react';
import { TeamMember } from './types';
import { useTeamMembers } from './hooks/useTeamMembers';
import { useProjectTeam } from './hooks/useProjectTeam';
import { useTeamMemberActions } from './hooks/useTeamMemberActions';
import TeamContainer from './components/TeamContainer';
import TeamContent from './components/TeamContent';
import TeamDialogs from './components/TeamDialogs';

interface ProjectTeamProps {
  team: TeamMember[];
  projectId?: string;
  onAddMember?: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => void;
  onRemoveMember?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ 
  team,
  projectId,
  onAddMember,
  onRemoveMember,
  onMakeManager
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  
  // Get team data and project manager name
  const { projectManagerName } = useProjectTeam(team, projectId);
  
  // Get team operations hooks
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
  } = useTeamMembers(team || [], projectId);

  // Set up team member actions
  const {
    isLocalAddingMember,
    handleAddTeamMember,
    handleRemoveTeamMember,
    handleMakeManager
  } = useTeamMemberActions({
    projectId,
    onAddMember,
    onRemoveMember,
    onMakeManager,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager,
    refreshTeamMembers
  });

  return (
    <>
      <TeamContainer>
        <TeamContent
          teamMembers={teamMembers}
          isRefreshing={isRefreshing}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          projectManagerName={projectManagerName}
          refreshTeamMembers={refreshTeamMembers}
          onAddMember={() => setIsAddMemberOpen(true)}
          onRemove={handleRemoveTeamMember}
          onMakeManager={handleMakeManager}
        />
      </TeamContainer>

      <TeamDialogs
        isAddMemberOpen={isAddMemberOpen}
        setIsAddMemberOpen={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={handleAddTeamMember}
        isAddingMember={isLocalAddingMember || isAdding}
      />
    </>
  );
};

export default ProjectTeam;
