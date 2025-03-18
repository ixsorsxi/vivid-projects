
import { useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectDataState } from './useProjectState';

export const useProjectTeam = (
  projectData: ProjectDataState,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectDataState>>
) => {
  // Handler to add members to the team
  const handleAddMember = useCallback((email: string, role?: string) => {
    // Check if member with this email already exists
    const memberName = email.split('@')[0];
    const memberExists = projectData.team.some(member => 
      member.name.toLowerCase() === memberName.toLowerCase()
    );
    
    if (memberExists) {
      toast.error(`Member already exists`, {
        description: "This team member is already part of the project",
      });
      return;
    }
    
    const newMember = {
      id: Date.now(),
      name: memberName,
      role: role || "Team Member"
    };

    setProjectData(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));

    toast(`Team member added`, {
      description: `Invitation sent to ${email}`,
    });
  }, [projectData.team, setProjectData]);

  // Handler to remove team members
  const handleRemoveMember = useCallback((memberId: number) => {
    setProjectData(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== memberId)
    }));

    toast(`Team member removed`, {
      description: "The team member has been removed from this project",
    });
  }, [setProjectData]);

  return {
    handleAddMember,
    handleRemoveMember
  };
};
