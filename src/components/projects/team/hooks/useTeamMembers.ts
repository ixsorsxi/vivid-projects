
import { TeamMember } from '../types';
import { useTeamDataFetch } from './useTeamDataFetch';
import { useTeamMemberAdd } from './useTeamMemberAdd';
import { useTeamMemberRemove } from './useTeamMemberRemove';
import { useTeamManagerAssignment } from './useTeamManagerAssignment';

/**
 * Hook for managing team members for a project
 */
export const useTeamMembers = (initialMembers: TeamMember[] = [], projectId?: string) => {
  // Use the separate hooks for each operation
  const { teamMembers, setTeamMembers, isRefreshing, refreshTeamMembers } = useTeamDataFetch(projectId);
  const { isAdding, handleAddMember } = useTeamMemberAdd(projectId, refreshTeamMembers);
  const { isRemoving, handleRemoveMember } = useTeamMemberRemove(teamMembers, projectId, refreshTeamMembers);
  const { isUpdating, assignProjectManager } = useTeamManagerAssignment(teamMembers, projectId, refreshTeamMembers);

  return {
    teamMembers,
    isRefreshing,
    isAdding,
    isRemoving,
    isUpdating,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  };
};
