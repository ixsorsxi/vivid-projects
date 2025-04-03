
import { useState } from 'react';
import { TeamMember } from '../../types';
import { useTeamAddMember } from './useTeamAddMember';
import { useTeamRemoveMember } from './useTeamRemoveMember';
import { useTeamManagerAssign } from './useTeamManagerAssign';

export const useTeamOperations = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  // Use the dedicated hooks
  const { isAdding, handleAddMember } = useTeamAddMember(teamMembers, setTeamMembers, projectId, refreshTeamMembers);
  const { isRemoving, handleRemoveMember } = useTeamRemoveMember(teamMembers, setTeamMembers, projectId, refreshTeamMembers);
  const { isUpdating, assignProjectManager } = useTeamManagerAssign(teamMembers, setTeamMembers, projectId, refreshTeamMembers);

  return {
    isAdding,
    isRemoving,
    isUpdating,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  };
};
