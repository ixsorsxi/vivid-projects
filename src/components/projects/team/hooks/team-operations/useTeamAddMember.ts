
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { addProjectTeamMember } from '@/api/projects/modules/team';
import { useAuth } from '@/context/auth';

export const useTeamAddMember = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const { user } = useAuth();

  const handleAddMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    console.log('Adding team member with data:', member);
    
    if (projectId) {
      // If we have a logged-in user, pass their ID for the operation to work with RLS
      const enhancedMember = {
        ...member,
        user_id: member.user_id || (user ? user.id : undefined)
      };
      
      console.log('Enhanced member data for API call:', enhancedMember);
      
      const success = await addProjectTeamMember(projectId, enhancedMember);
      
      if (success) {
        // After successful API call, immediately update the UI first
        const newMember: TeamMember = {
          id: member.id || String(Date.now()),
          name: member.name,
          role: member.role,
          user_id: member.user_id
        };
        
        console.log('Adding new team member to UI:', newMember);
        
        setTeamMembers(prev => [...prev, newMember]);
        
        toast.success("Team member added", {
          description: `${member.name} has been added to the project team`,
        });
        
        // Then refresh to ensure we have the latest data
        if (refreshTeamMembers) {
          console.log('Refreshing team members after adding');
          await refreshTeamMembers();
        }
      } else {
        console.error('Failed to add team member through API');
        toast.error("Failed to add team member", {
          description: "There was an error adding the team member to the project",
        });
      }
    } else {
      // Local-only addition (no projectId)
      const newMember: TeamMember = {
        id: member.id || String(Date.now()),
        name: member.name,
        role: member.role,
        user_id: member.user_id
      };
      
      console.log('Adding team member locally (no projectId):', newMember);
      setTeamMembers([...teamMembers, newMember]);
      
      toast("Team member added", {
        description: `${member.name} has been added to the project team`,
      });
    }
  };

  return {
    handleAddMember
  };
};
