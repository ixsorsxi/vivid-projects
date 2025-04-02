
import { TeamMember } from '../../types';
import { useTeamAddMember } from './useTeamAddMember';
import { useTeamRemoveMember } from './useTeamRemoveMember';

export const useTeamOperations = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const { handleAddMember } = useTeamAddMember(
    teamMembers, 
    setTeamMembers, 
    projectId, 
    refreshTeamMembers
  );
  
  const { isRemoving, handleRemoveMember } = useTeamRemoveMember(
    teamMembers, 
    setTeamMembers, 
    projectId, 
    refreshTeamMembers
  );

  return {
    isRemoving,
    handleAddMember,
    handleRemoveMember
  };
};
