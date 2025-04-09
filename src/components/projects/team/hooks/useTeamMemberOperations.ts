
import { useState } from 'react';
import { addProjectTeamMember } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Hook for handling team member operations
 */
export const useTeamMemberOperations = (projectId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  /**
   * Add a team member to the project
   */
  const addTeamMember = async (member: {
    name: string;
    role: string;
    email?: string;
    user_id?: string;
  }): Promise<boolean> => {
    if (!projectId) {
      const error = new Error('Project ID is required');
      setLastError(error);
      debugError('TeamOperations', error.message);
      return false;
    }

    setIsSubmitting(true);
    debugLog('TeamOperations', `Adding member to project ${projectId}:`, member);

    try {
      // Call the API function with explicit parameters to avoid confusion
      const success = await addProjectTeamMember(projectId, {
        name: member.name,
        role: member.role,
        email: member.email,
        user_id: member.user_id
      });

      if (success) {
        debugLog('TeamOperations', 'Successfully added team member');
        toast.success('Team member added', {
          description: `${member.name} has been added to the project team`
        });
        return true;
      } else {
        const error = new Error('Failed to add team member');
        setLastError(error);
        debugError('TeamOperations', error.message);
        toast.error('Error adding team member', {
          description: 'The operation was unsuccessful'
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(error instanceof Error ? error : new Error(errorMessage));
      debugError('TeamOperations', 'Error adding team member:', error);
      
      toast.error('Error adding team member', {
        description: errorMessage
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
