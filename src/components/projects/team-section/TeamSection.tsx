
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from 'react-router-dom';
import { useTeamAccess } from './hooks/useTeamAccess';
import TeamCardHeader from './components/TeamCardHeader';
import TeamLoadingState from './components/TeamLoadingState';
import TeamAccessDenied from './components/TeamAccessDenied';
import TeamMembersList from './components/TeamMembersList';
import AddMemberDialog from './AddMemberDialog';

const TeamSection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    isAddingMember,
    fetchTeamMembers,
    handleAddMember,
    handleRemoveMember
  } = useTeamAccess(projectId);

  const handleRetryFetch = async () => {
    setIsRetrying(true);
    try {
      await fetchTeamMembers();
    } finally {
      setIsRetrying(false);
    }
  };

  if (!projectId) {
    return (
      <Card>
        <TeamCardHeader 
          onAddMember={() => {}} 
          onRefresh={() => {}} 
          isLoading={false} 
          isRetrying={false}
          hasAccess={false}
        />
        <CardContent>
          <p className="text-muted-foreground">Please select a project to view its team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <TeamCardHeader 
          onAddMember={() => setIsAddDialogOpen(true)} 
          onRefresh={handleRetryFetch} 
          isLoading={isLoading} 
          isRetrying={isRetrying}
          hasAccess={hasAccess}
        />
        <CardContent>
          {/* Show loading or error state */}
          <TeamLoadingState 
            isLoading={isLoading || isRetrying}
            hasError={!!error}
            errorMessage={error?.message}
            onRetry={handleRetryFetch}
          />

          {/* Show access denied state */}
          {!isLoading && !isRetrying && !hasAccess && (
            <TeamAccessDenied onCheckAccessAgain={handleRetryFetch} />
          )}

          {/* Show team members list when data is loaded and user has access */}
          {!isLoading && !isRetrying && hasAccess && !error && (
            <TeamMembersList 
              teamMembers={teamMembers} 
              onRemoveMember={handleRemoveMember} 
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding new team members */}
      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        projectId={projectId || ''}
        onAddMember={handleAddMember}
        isSubmitting={isAddingMember}
      />
    </div>
  );
};

export default TeamSection;
