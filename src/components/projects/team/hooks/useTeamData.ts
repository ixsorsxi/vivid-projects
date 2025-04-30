
import { useState, useEffect } from 'react';
import { TeamMember } from '@/api/projects/modules/team/types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team/fetchTeamMembers';
import { ProjectRoleKey } from '../types';

export const useTeamData = (projectId: string) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const teamMembers = await fetchProjectTeamMembers(projectId);
        setMembers(teamMembers);
        setError(null);
      } catch (err: any) {
        console.error('Error loading team members:', err);
        setError(err.message || 'Failed to load team members');
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamMembers();
  }, [projectId]);

  // Function to add a new member to the local state
  const addMember = (newMember: TeamMember) => {
    setMembers(prev => [...prev, newMember]);
  };

  // Function to remove a member from the local state
  const removeMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  // Function to update a member's role
  const updateMemberRole = (memberId: string, role: ProjectRoleKey) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, role } : member
      )
    );
  };

  // Helper to find a member by ID
  const getMemberById = (memberId: string): TeamMember => {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`);
    }
    return member;
  };

  // Helper to extract role key from role data
  const extractRoleKey = (roleData: any): ProjectRoleKey => {
    if (roleData && typeof roleData === 'object' && roleData.role_key) {
      return roleData.role_key as ProjectRoleKey;
    }
    // Default role if we can't get it
    return 'team_member';
  };

  return {
    members,
    setMembers,
    isLoading,
    error,
    addMember,
    removeMember,
    updateMemberRole,
    getMemberById,
    extractRoleKey
  };
};
