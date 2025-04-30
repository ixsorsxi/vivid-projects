
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
  const { members, setMembers, isLoading, isRefreshing, error, fetchMembers } = useTeamDataFetch(projectId);
  const { isAdding, handleAddMember } = useTeamMemberAdd(projectId, fetchMembers);
  const { isRemoving, handleRemoveMember } = useTeamMemberRemove(projectId);
  const { isUpdating, assignProjectManager } = useTeamManagerAssignment(projectId);

  return {
    teamMembers: members,
    isRefreshing,
    isAdding,
    isRemoving,
    isUpdating,
    refreshTeamMembers: fetchMembers,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  };
};
