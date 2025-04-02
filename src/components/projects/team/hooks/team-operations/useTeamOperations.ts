
import { useState } from 'react';
import { TeamMember } from '../../types';
import { useTeamAddMember } from './useTeamAddMember';
import { useTeamRemoveMember } from './useTeamRemoveMember';

export const useTeamOperations = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  
  const { handleAddMember } = useTeamAddMember(
    teamMembers,
    setTeamMembers,
    projectId,
    refreshTeamMembers
  );
  
  const { handleRemoveMember } = useTeamRemoveMember(
    teamMembers,
    setTeamMembers,
    setIsRemoving,
    projectId,
    refreshTeamMembers
  );
  
  return {
    isRemoving,
    handleAddMember,
    handleRemoveMember
  };
};
