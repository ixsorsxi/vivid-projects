
import { useState, useCallback } from 'react';
import { TeamMember, ProjectRoleKey } from '../types';

export const useTeamData = (initialMembers: TeamMember[] = []) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  
  const addMember = useCallback((newMember: TeamMember) => {
    setMembers(prev => {
      // Check if member already exists
      const exists = prev.some(member => member.id === newMember.id);
      if (exists) {
        return prev;
      }
      
      return [...prev, newMember];
    });
  }, []);
  
  const removeMember = useCallback((memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  }, []);
  
  const updateMemberRole = useCallback((memberId: string, role: ProjectRoleKey) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, role } 
          : member
      )
    );
  }, []);
  
  const getMemberById = useCallback((memberId: string) => {
    return members.find(member => member.id === memberId) || null;
  }, [members]);
  
  // Safely extract role_key from the API response
  const extractRoleKey = useCallback((roleData: any): ProjectRoleKey => {
    if (!roleData) return 'team_member';
    
    // If it's already a string, treat it as a ProjectRoleKey
    if (typeof roleData === 'string') {
      return roleData as ProjectRoleKey;
    }
    
    // If it's an object with a role_key property
    if (typeof roleData === 'object' && roleData.role_key) {
      return roleData.role_key as ProjectRoleKey;
    }
    
    // If it's an array with objects that have role_key (convert first element)
    if (Array.isArray(roleData) && roleData.length > 0 && roleData[0] && roleData[0].role_key) {
      return roleData[0].role_key as ProjectRoleKey;
    }
    
    // Default if nothing matches
    return 'team_member';
  }, []);
  
  return {
    members,
    setMembers,
    addMember,
    removeMember,
    updateMemberRole,
    getMemberById,
    extractRoleKey
  };
};
