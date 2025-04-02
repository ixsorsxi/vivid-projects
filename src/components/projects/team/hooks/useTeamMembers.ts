
import { TeamMember } from '../types';
import { useTeamData } from './team-data/useTeamData';
import { useTeamOperations } from './team-operations/useTeamOperations';

export const useTeamMembers = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  } = useTeamData(initialTeam, projectId);

  const {
    isRemoving,
    handleAddMember,
    handleRemoveMember
  } = useTeamOperations(teamMembers, setTeamMembers, projectId, refreshTeamMembers);

  return {
    teamMembers,
    isRefreshing,
    isRemoving,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember
  };
};
