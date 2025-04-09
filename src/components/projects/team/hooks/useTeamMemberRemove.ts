
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { removeProjectTeamMember } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';

export const useTeamMemberRemove = (
  projectId: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveMember = async (memberId: string): Promise<boolean> => {
    if (!projectId) {
      debugError('TeamMemberRemove', 'No project ID provided for removing team member');
      toast.error('Unable to remove team member', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsRemoving(true);
    
    try {
      debugLog('TeamMemberRemove', 'Removing team member:', memberId, 'from project:', projectId);
      
      // Use the API function to remove the member
      const success = await removeProjectTeamMember(projectId, memberId);
      
      if (success) {
        toast.success('Team member removed', {
          description: `The team member has been removed from the project.`
        });
        
        // Refresh team members if a refresh function is provided
        if (refreshTeamMembers) {
          setTimeout(() => {
            refreshTeamMembers();
          }, 500);
        }
        
        return true;
      } else {
        toast.error('Error removing team member', {
          description: 'There was a problem removing the team member. Please try again.'
        });
        return false;
      }
    } catch (error) {
      debugError('TeamMemberRemove', 'Error in handleRemoveMember:', error);
      toast.error('Error removing team member', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.'
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
