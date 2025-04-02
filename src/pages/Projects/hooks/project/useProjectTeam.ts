
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectTeam = (projectData: any, setProjectData: any) => {
  // Format role string to ensure consistent formatting
  const formatRoleString = (role: string): string => {
    // Replace spaces with hyphens and make lowercase for DB storage
    return role.trim().toLowerCase().replace(/\s+/g, '-');
  };

  // Handler to add a new team member
  const handleAddMember = useCallback((member: { id?: string; name: string; role: string; email?: string }) => {
    // Create new member from email and role
    const memberName = member.name || (member.email ? member.email.split('@')[0] : 'Team Member');
    const newMemberId = member.id || String(Date.now()); // Ensure ID is string
    const formattedRole = formatRoleString(member.role || "Team Member");
    
    const newMember = {
      id: newMemberId,
      name: memberName,
      role: formattedRole
    };
    
    setProjectData((prev: any) => ({
      ...prev,
      team: [...(prev.team || []), newMember],
      // Also update the members array to ensure compatibility with components
      members: [...(prev.members || []), { id: newMemberId, name: newMember.name }]
    }));

    toast(`Team member added`, {
      description: `${memberName} has been added to the project`,
    });
  }, [setProjectData]);

  // Handler to remove a team member
  const handleRemoveMember = useCallback((memberId: number | string) => {
    const stringMemberId = String(memberId); // Convert to string to ensure consistent comparison
    
    setProjectData((prev: any) => ({
      ...prev,
      team: (prev.team || []).filter((m: any) => String(m.id) !== stringMemberId),
      // Also update the members array to ensure compatibility with components
      members: (prev.members || []).filter((m: any) => String(m.id) !== stringMemberId)
    }));

    toast(`Team member removed`, {
      description: "The team member has been removed from the project",
    });
  }, [setProjectData]);

  return {
    handleAddMember,
    handleRemoveMember
  };
};
