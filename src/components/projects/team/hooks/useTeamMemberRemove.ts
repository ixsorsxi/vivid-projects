
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';
import { removeProjectTeamMember } from '@/api/projects/modules/team';

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
  const handleRemoveMember = async (memberId: string): Promise<boolean> => {
    if (!projectId) {
      console.error('[TEAM-OPS] No project ID provided for removing team member');
      toast.error('Unable to remove team member', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsRemoving(true);
    
    try {
      console.log('[TEAM-OPS] Removing team member from project:', projectId, 'memberId:', memberId);
      
      // Use the API function to remove the member
      const success = await removeProjectTeamMember(projectId, memberId);
      
      if (success) {
        console.log('[TEAM-OPS] Successfully removed team member:', memberId);
        return true;
      } else {
        console.error('[TEAM-OPS] Failed to remove team member via API');
        return false;
      }
    } catch (error) {
      console.error('[TEAM-OPS] Error in handleRemoveMember:', error);
      return false;
    } finally {
      setIsRemoving(false);
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        try {
          console.log('[TEAM-OPS] Refreshing team members after remove operation');
          await refreshTeamMembers();
        } catch (refreshError) {
          console.error('[TEAM-OPS] Error refreshing team members:', refreshError);
        }
      }
    }
  };

  return {
    isRemoving,
    handleRemoveMember
  };
};
