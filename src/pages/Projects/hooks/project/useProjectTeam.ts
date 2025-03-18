
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectTeam = (projectData: any, setProjectData: any) => {
  // Handler to add a new team member
  const handleAddMember = useCallback((newMember: { id: number; name: string; role: string }) => {
    setProjectData((prev: any) => ({
      ...prev,
      team: [...prev.team, newMember],
      // Also update the members array to ensure compatibility with components
      members: [...(prev.members || []), { id: String(newMember.id), name: newMember.name }]
    }));

    toast(`Team member added`, {
      description: `${newMember.name} has been added to the project`,
    });
  }, [setProjectData]);

  // Handler to remove a team member
  const handleRemoveMember = useCallback((memberId: number | string) => {
    setProjectData((prev: any) => ({
      ...prev,
      team: prev.team.filter((m: any) => m.id !== memberId),
      // Also update the members array to ensure compatibility with components
      members: (prev.members || []).filter((m: any) => m.id !== memberId)
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
