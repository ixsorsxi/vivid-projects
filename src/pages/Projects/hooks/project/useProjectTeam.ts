import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectTeam = (projectData: any, setProjectData: any) => {
  // Format role string to ensure consistent formatting
  const formatRoleString = (role: string): string => {
    // First, ensure we have a valid string
    if (!role) return 'team-member';
    
    // If the role already looks like a database format (kebab-case), keep it
    if (role.includes('-')) return role;
    
    // Otherwise, convert to kebab-case for consistent storage
    return role.trim()
              .toLowerCase()
              .replace(/\s+/g, '-')    // Replace spaces with hyphens
              .replace(/[^a-z0-9-]/g, ''); // Remove any other special characters
  };

  // Handler to add a new team member
  const handleAddMember = useCallback((member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    // Ensure member has required properties
    if (!member || !member.name) {
      console.error('Invalid member data provided to handleAddMember:', member);
      return;
    }
    
    // Create new member with correct data format
    const newMemberId = member.id || String(Date.now()); // Ensure ID is string
    const formattedRole = formatRoleString(member.role || "Team Member");
    
    const newMember = {
      id: newMemberId,
      name: member.name, // Prioritize using the name field
      role: formattedRole,
      user_id: member.user_id
    };
    
    console.log('Adding new team member:', newMember);
    
    setProjectData((prev: any) => ({
      ...prev,
      team: [...(prev.team || []), newMember],
      // Also update the members array to ensure compatibility with components
      members: [...(prev.members || []), { id: newMemberId, name: newMember.name }]
    }));

    toast(`Team member added`, {
      description: `${member.name} has been added to the project`,
    });
  }, [setProjectData]);

  // Handler to remove a team member
  const handleRemoveMember = useCallback((memberId: number | string) => {
    const stringMemberId = String(memberId); // Convert to string to ensure consistent comparison
    
    console.log('Removing team member with ID:', stringMemberId);
    
    setProjectData((prev: any) => {
      // Find the member being removed for better user feedback
      const memberToRemove = (prev.team || []).find((m: any) => String(m.id) === stringMemberId);
      const memberName = memberToRemove?.name || 'Team member';
      
      // Remove from both team and members arrays
      const updatedData = {
        ...prev,
        team: (prev.team || []).filter((m: any) => String(m.id) !== stringMemberId),
        members: (prev.members || []).filter((m: any) => String(m.id) !== stringMemberId)
      };
      
      // Show toast with the actual member name
      toast(`Team member removed`, {
        description: `${memberName} has been removed from the project`,
      });
      
      return updatedData;
    });
  }, [setProjectData]);

  return {
    handleAddMember,
    handleRemoveMember
  };
};
