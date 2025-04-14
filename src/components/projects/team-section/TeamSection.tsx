
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useProjectTeam } from './hooks/useProjectTeam';
import TeamCardHeader from './components/TeamCardHeader';
import TeamMembersList from './components/TeamMembersList';
import TeamLoadingState from './components/TeamLoadingState';
import TeamAccessDenied from './components/TeamAccessDenied';
import AddTeamMemberDialog from './components/AddTeamMemberDialog';

interface TeamSectionProps {
  projectId: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ projectId }) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  
  const { 
    teamMembers, 
    isLoading, 
    error, 
    hasAccess,
    isRetrying,
    refreshTeam,
    addTeamMember,
    removeTeamMember
  } = useProjectTeam(projectId);

  if (!hasAccess) {
    return <TeamAccessDenied onCheckAccessAgain={refreshTeam} />;
  }

  return (
    <Card className="w-full">
      <TeamCardHeader
        onAddMember={() => setIsAddMemberOpen(true)}
        onRefresh={refreshTeam}
        isLoading={isLoading}
        isRetrying={isRetrying}
        hasAccess={hasAccess}
      />
      
      <CardContent>
        {isLoading || error ? (
          <TeamLoadingState
            isLoading={isLoading}
            hasError={!!error}
            errorMessage={error?.message}
            onRetry={refreshTeam}
          />
        ) : (
          <TeamMembersList 
            teamMembers={teamMembers} 
            currentProjectId={projectId}
            onRemoveMember={removeTeamMember}
          />
        )}
      </CardContent>
      
      <AddTeamMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={addTeamMember}
      />
    </Card>
  );
};

export default TeamSection;
