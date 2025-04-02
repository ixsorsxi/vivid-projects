
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
    const memberId = String(id);
    setIsRemoving(memberId);
    
    try {
      // Find member for better user feedback
      const memberToRemove = teamMembers.find(m => String(m.id) === memberId);
      const memberName = memberToRemove?.name || 'Team member';
      
      console.log(`Removing team member: ${memberName} (ID: ${memberId})`);
      
      if (projectId) {
        // First update the UI for immediate feedback
        setTeamMembers(prev => prev.filter(m => String(m.id) !== memberId));
        
        // Then attempt to remove from database
        const success = await removeProjectTeamMember(projectId, memberId);
        
        if (success) {
          toast.success("Team member removed", {
            description: `${memberName} has been removed from the project`
          });
          
          // Refresh to get the latest data after successful removal
          if (refreshTeamMembers) {
            await refreshTeamMembers();
          }
        } else {
          toast.error("Failed to remove team member", {
            description: "There was a database error. Please try again."
          });
          
          // Revert UI change if DB operation failed
          if (refreshTeamMembers) {
            await refreshTeamMembers();
          }
        }
      } else {
        // Local state only - no database operation
        setTeamMembers(prev => prev.filter(m => String(m.id) !== memberId));
        
        toast(`Team member removed`, {
          description: `${memberName} has been removed from the project`,
        });
      }
    } catch (error) {
      console.error('Error in handleRemoveMember:', error);
      toast.error("Error removing team member", {
        description: "An unexpected error occurred"
      });
      
      // Refresh to restore original state
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
