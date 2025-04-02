
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { removeProjectTeamMember } from '@/api/projects/modules/team';

export const useTeamRemoveMember = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveMember = async (id: string | number) => {
    const stringId = id.toString();
    setIsRemoving(stringId);
    
    try {
      if (projectId) {
        console.log(`Attempting to remove team member with ID: ${stringId} from project: ${projectId}`);
        console.log('Current team members before removal:', teamMembers);
        
        // Find the member we're removing for better error messages
        const memberToRemove = teamMembers.find(member => member.id.toString() === stringId);
        console.log('Removing member:', memberToRemove);
        
        if (memberToRemove) {
          // Immediately update the UI by filtering out the removed member
          setTeamMembers(current => current.filter(member => member.id.toString() !== stringId));
          
          // Then attempt the server operation
          const success = await removeProjectTeamMember(projectId, stringId);
          
          if (success) {
            console.log('Successfully removed team member with ID:', stringId);
            toast.success("Team member removed", {
              description: `${memberToRemove.name || 'The team member'} has been removed from the project`,
            });
            
            // Refresh from server to ensure we have the latest data
            if (refreshTeamMembers) {
              await refreshTeamMembers();
            }
          } else {
            console.error(`Failed to remove team member with ID: ${stringId}`);
            toast.error("Failed to remove team member", {
              description: "There was an error removing the team member from the project",
            });
            
            // Refresh from server to ensure UI is consistent with server state
            if (refreshTeamMembers) {
              await refreshTeamMembers();
            }
          }
        } else {
          console.error(`Could not find team member with ID: ${stringId}`);
          toast.error("Member not found", {
            description: "Could not locate the team member in the current team",
          });
        }
      } else {
        // When no projectId is provided, simply update local state (for demo/frontend-only use)
        const memberToRemove = teamMembers.find(member => member.id.toString() === stringId);
        const updatedTeam = teamMembers.filter(member => member.id.toString() !== stringId);
        setTeamMembers(updatedTeam);
        toast("Team member removed", {
          description: `${memberToRemove?.name || 'The team member'} has been removed from the project`,
        });
      }
    } catch (error) {
      console.error("Error in handleRemoveMember:", error);
      toast.error("Error removing team member", {
        description: "An unexpected error occurred",
      });
      
      // Refresh to ensure UI is consistent with server state
      if (refreshTeamMembers) {
        await refreshTeamMembers();
      }
    } finally {
      setIsRemoving(null);
    }
  };

  return {
    isRemoving,
    handleRemoveMember
  };
};
