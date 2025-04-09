
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { addProjectTeamMember } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';

interface TeamMemberAddProps {
  name: string;
  role: string;
  email?: string;
  user_id?: string;
}

/**
 * Hook for handling team member addition operations
 */
export const useTeamMemberOperations = (projectId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  /**
   * Adds a team member to the project
   * @param member The member to add
   * @returns Promise that resolves to a boolean indicating success/failure
   */
  const addTeamMember = async (member: TeamMemberAddProps): Promise<boolean> => {
    if (!projectId) {
      debugError('TeamMemberOperations', 'No project ID provided for adding team member');
      toast.error('Unable to add team member', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsSubmitting(true);
    setLastError(null);
    
    try {
      debugLog('TeamMemberOperations', 'Adding team member to project:', projectId, member);
      
      // Make sure we're passing the data in the correct format
      const success = await addProjectTeamMember(
        projectId,
        {
          name: member.name,
          role: member.role,
          email: member.email,
          user_id: member.user_id
        }
      );
      
      if (success) {
        debugLog('TeamMemberOperations', `Successfully added ${member.name} to project`);
        toast.success('Team member added', {
          description: `${member.name} has been added to the project team`
        });
        return true;
      } else {
        debugError('TeamMemberOperations', `Failed to add ${member.name} to project via API`);
        toast.error('Failed to add team member', {
          description: 'The operation was unsuccessful'
        });
        return false;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setLastError(err);
      debugError('TeamMemberOperations', 'Error in addTeamMember:', error);
      toast.error('Error adding team member', {
        description: err.message
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    lastError,
    addTeamMember
  };
};
