
import { useState, useEffect } from 'react';
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
    isAdding,
    isRemoving,
    isUpdating,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  } = useTeamOperations(teamMembers, setTeamMembers, projectId, refreshTeamMembers);
  
  // Debug the state of team members
  useEffect(() => {
    console.log('[useTeamMembers] Current team members state:', teamMembers);
  }, [teamMembers]);

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
