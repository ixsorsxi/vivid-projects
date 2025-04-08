
import { useState } from 'react';
import { addProjectTeamMember } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Hook for adding team members to a project
 */
export const useTeamMemberAddition = (projectId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const addTeamMember = async (member: {
    id?: string;
    name: string;
    role: string;
    email?: string;
    user_id?: string;
  }): Promise<boolean> => {
    if (!projectId) {
      const error = new Error('Project ID is missing');
      setLastError(error);
      toast.error('Cannot add team member', {
        description: 'Project ID is missing'
      });
      return false;
    }

    setIsSubmitting(true);
    debugLog('TeamAddition', 'Adding team member to project:', projectId);
    debugLog('TeamAddition', 'Member data:', member);

    try {
      // Use addProjectTeamMember function from the API module
      const success = await addProjectTeamMember(projectId, {
        name: member.name,
        role: member.role,
        email: member.email,
        user_id: member.user_id
      });

      if (success) {
        toast.success('Team member added', {
          description: `${member.name} has been added to the project team`
        });
        return true;
      } else {
        toast.error('Failed to add team member', {
          description: 'The operation was unsuccessful. Please try again.'
        });
        return false;
      }
    } catch (error) {
      debugError('TeamAddition', 'Error adding team member:', error);
      setLastError(error instanceof Error ? error : new Error('Unknown error'));
      
      // Extract and format error message
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Make error messages more user-friendly
        if (errorMessage.includes('already a member')) {
          errorMessage = 'This user is already a member of this project';
        } else if (errorMessage.includes('Permission denied')) {
          errorMessage = 'You don\'t have permission to add members to this project';
        } else if (errorMessage.includes('violates row-level security')) {
          errorMessage = 'Permission denied: Unable to add member due to security settings';
        }
      }
      
      toast.error('Error adding team member', {
        description: errorMessage
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addTeamMember,
    isSubmitting,
    lastError
  };
};
