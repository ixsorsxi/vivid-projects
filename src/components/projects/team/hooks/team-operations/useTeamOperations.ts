
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { addProjectTeamMember, removeProjectTeamMember } from '@/api/projects/modules/team';
import { useAuth } from '@/context/auth';

export const useTeamOperations = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAddMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    if (projectId) {
      // If we have a logged-in user, pass their ID for the operation to work with RLS
      const enhancedMember = {
        ...member,
        user_id: member.user_id || (user ? user.id : undefined)
      };
      
      const success = await addProjectTeamMember(projectId, enhancedMember);
      
      if (success) {
        // After successful API call, immediately update the UI first
        const newMember: TeamMember = {
          id: member.id || String(Date.now()),
          name: member.name,
          role: member.role,
          user_id: member.user_id
        };
        
        setTeamMembers(prev => [...prev, newMember]);
        
        toast.success("Team member added", {
          description: `${member.name} has been added to the project team`,
        });
        
        // Then refresh to ensure we have the latest data
        if (refreshTeamMembers) {
          await refreshTeamMembers();
        }
      } else {
        toast.error("Failed to add team member", {
          description: "There was an error adding the team member to the project",
        });
      }
    } else {
      const newMember: TeamMember = {
        id: member.id || String(Date.now()),
        name: member.name,
        role: member.role,
        user_id: member.user_id
      };
      
      setTeamMembers([...teamMembers, newMember]);
      toast("Team member added", {
        description: `${member.name} has been added to the project team`,
      });
    }
  };

  const handleRemoveMember = async (id: string | number) => {
    const stringId = id.toString();
    setIsRemoving(stringId);
    
    try {
      if (projectId) {
        console.log(`Attempting to remove team member with ID: ${stringId} from project: ${projectId}`);
        
        // Immediately update the UI by filtering out the removed member
        setTeamMembers(current => current.filter(member => member.id.toString() !== stringId));
        
        // Then attempt the server operation
        const success = await removeProjectTeamMember(projectId, stringId);
        
        if (success) {
          toast.success("Team member removed", {
            description: "The team member has been removed from the project",
          });
          
          // We've already updated the UI, so no need to update again
          // Just refresh from server to ensure we have the latest data
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
        const updatedTeam = teamMembers.filter(member => member.id.toString() !== stringId);
        setTeamMembers(updatedTeam);
        toast("Team member removed", {
          description: "The team member has been removed from the project",
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
    handleAddMember,
    handleRemoveMember
  };
};
