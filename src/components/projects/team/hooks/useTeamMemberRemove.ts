
import { useState } from 'react';
import { removeProjectTeamMember } from '@/api/projects/modules/team';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';

/**
 * Hook for removing team members
 */
export const useTeamMemberRemove = (
  teamMembers: TeamMember[],
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState(false);

  // Handle removing a team member
  const handleRemoveMember = async (memberId: string | number): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided for removing team member');
      return false;
    }
    
    setIsRemoving(true);
    
    try {
      // Find the member to be removed for better user feedback
      const memberToRemove = teamMembers.find(m => String(m.id) === String(memberId));
      
      const success = await removeProjectTeamMember(projectId, String(memberId));
      
      if (success) {
        if (memberToRemove) {
          toast.success('Team member removed', {
            description: `${memberToRemove.name} has been removed from the project.`
          });
        }
        
        // Refresh team members list if needed
        if (refreshTeamMembers) {
          await refreshTeamMembers();
        }
        
        return true;
      } else {
        toast.error('Failed to remove team member', {
          description: 'There was an issue removing the team member from the project.'
        });
        return false;
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Error removing team member', {
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    isRemoving,
    handleRemoveMember
  };
};
