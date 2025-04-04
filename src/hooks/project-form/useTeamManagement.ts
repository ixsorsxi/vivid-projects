
import { useState } from 'react';
import { TeamMember } from '@/lib/types/common';

export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Team member management
  const addTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member]);
  };

  const updateTeamMember = (memberId: string | number, field: keyof TeamMember, value: string) => {
    const updatedMembers = teamMembers.map(member => {
      if (member.id === memberId) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setTeamMembers(updatedMembers);
  };

  const removeTeamMember = (memberId: string | number) => {
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
