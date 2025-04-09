
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

  /**
   * Adds a team member to the project
   * @param member The member to add
   * @returns Promise that resolves to a boolean indicating success/failure
   */
  const addTeamMember = async (member: TeamMemberAddProps): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided for adding team member');
      toast.error('Unable to add team member', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      debugLog('TeamMemberOperations', 'Adding team member to project:', projectId, member);
      
      // Use the API function to add the member
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
        return true;
      } else {
        debugError('TeamMemberOperations', `Failed to add ${member.name} to project via API`);
        return false;
      }
    } catch (error) {
      debugError('TeamMemberOperations', 'Error in addTeamMember:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    addTeamMember
  };
};
