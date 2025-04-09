
import { useState } from 'react';
import { addProjectTeamMember } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Hook for adding team members to a project
 */
export const useTeamMemberAdd = (
  projectId: string | undefined,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  /**
   * Add a team member to the project
   */
  const handleAddMember = async (member: {
    name: string;
    role: string;
    email?: string;
    user_id?: string;
  }): Promise<boolean> => {
    if (!projectId) {
      const error = new Error('No project ID provided');
      setLastError(error);
      debugError('useTeamMemberAdd', error.message);
      return false;
    }

    setIsAdding(true);
    setLastError(null);

    try {
      debugLog('useTeamMemberAdd', 'Adding member:', member);

      // Use the API function to add the member
      const success = await addProjectTeamMember(projectId, {
        name: member.name,
        role: member.role,
        email: member.email,
        user_id: member.user_id
      });

      debugLog('useTeamMemberAdd', 'Result:', success);
      
      // If successful and we have a refresh function, refresh the team members
      if (success && refreshTeamMembers) {
        await refreshTeamMembers();
      }

      return success;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to add team member');
      setLastError(errorObj);
      debugError('useTeamMemberAdd', 'Error:', errorObj);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isAdding,
    lastError,
    handleAddMember
  };
};
