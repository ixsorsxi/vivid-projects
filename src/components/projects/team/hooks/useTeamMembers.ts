
import { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { useTeamData } from './team-data/useTeamData';
import { useTeamOperations } from './useTeamOperations';
import { useTeamAddMember } from './team-operations/useTeamAddMember';

export const useTeamMembers = (initialTeam: TeamMember[] = [], projectId?: string) => {
  const {
    teamMembers,
    setTeamMembers,
    isRefreshing,
    refreshTeamMembers
  } = useTeamData(initialTeam, projectId);
  
  const {
    isAdding,
    handleAddMember
  } = useTeamAddMember(teamMembers, setTeamMembers, projectId, refreshTeamMembers);
  
  const {
    isRemoving,
    isUpdating,
    handleRemoveMember,
    assignProjectManager
  } = useTeamOperations(teamMembers, setTeamMembers, projectId, refreshTeamMembers);
  
  // Debug the state of team members
  useEffect(() => {
    console.log('[useTeamMembers] Current team members state:', teamMembers);
  }, [teamMembers]);

  // Force refresh team members when projectId changes or on initial mount
  useEffect(() => {
    if (projectId) {
      console.log('[useTeamMembers] Project ID changed or component mounted, refreshing team members');
      refreshTeamMembers();
    }
  }, [projectId, refreshTeamMembers]);

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
