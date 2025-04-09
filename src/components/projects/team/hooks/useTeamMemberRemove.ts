
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';
import { removeProjectTeamMember } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Hook for handling team member removal operations
 */
export const useTeamMemberRemove = (
  teamMembers: TeamMember[],
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState(false);

  /**
   * Removes a team member from the project
   * @param memberId The ID of the member to remove
   * @returns Promise that resolves to a boolean indicating success/failure
   */
  const handleRemoveMember = async (memberId: string | number): Promise<boolean> => {
    if (!projectId) {
      debugError('useTeamMemberRemove', 'No project ID provided');
      toast.error('Unable to remove team member', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsRemoving(true);
    
    try {
      const stringMemberId = String(memberId);
      const memberToRemove = teamMembers.find(m => String(m.id) === stringMemberId);
      
      if (!memberToRemove) {
        debugError('useTeamMemberRemove', 'Member not found with ID:', stringMemberId);
        return false;
      }
      
      debugLog('useTeamMemberRemove', 'Removing team member:', memberToRemove.name);
      
      // Use the API function to remove the member
      const success = await removeProjectTeamMember(projectId, stringMemberId);
      
      if (success) {
        toast.success('Team member removed', {
          description: `${memberToRemove.name} has been removed from the project team`
        });
        
        return true;
      } else {
        toast.error('Failed to remove team member', {
          description: 'There was an issue removing the team member. Please try again.'
        });
        return false;
      }
    } catch (error) {
      debugError('useTeamMemberRemove', 'Error:', error);
      toast.error('Error removing team member', {
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsRemoving(false);
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
      }
    }
  };

  return {
    isRemoving,
    handleRemoveMember
  };
};
