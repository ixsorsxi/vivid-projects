
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectTeam = (projectData: any, setProjectData: any) => {
  // Handler to add a new team member
  const handleAddMember = useCallback((email: string, role: string) => {
    // Create new member from email and role
    const memberName = email.includes('@') ? email.split('@')[0] : email;
    const newMemberId = String(Date.now()); // Ensure ID is string
    const newMember = {
      id: newMemberId,
      name: memberName,
      role: role || "Team Member"
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
