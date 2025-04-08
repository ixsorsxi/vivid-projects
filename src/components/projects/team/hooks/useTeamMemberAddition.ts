
import { useState } from 'react';
import { addProjectTeamMember } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Hook for adding team members to a project
 */
export const useTeamMemberAddition = (projectId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTeamMember = async (member: {
    id?: string;
    name: string;
    role: string;
    email?: string;
    user_id?: string;
  }): Promise<boolean> => {
    if (!projectId) {
      toast.error('Project ID is missing', {
        description: 'Cannot add team member without a project ID'
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
      
      // Extract and format error message
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Make error messages more user-friendly
        if (errorMessage.includes('already a member')) {
          errorMessage = 'This user is already a member of this project';
        } else if (errorMessage.includes('Permission denied')) {
          errorMessage = 'You don\'t have permission to add members to this project';
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
    isSubmitting
  };
};
