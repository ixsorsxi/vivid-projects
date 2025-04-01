
import { useState } from 'react';
import { TeamMember } from './types';

export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Team member management
  const addTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member]);
  };

  const updateTeamMember = (memberId: string, field: keyof TeamMember, value: string) => {
    const updatedMembers = teamMembers.map(member => {
      if (member.id === memberId) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setTeamMembers(updatedMembers);
  };

  const removeTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  return {
    teamMembers,
    setTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember
  };
};
