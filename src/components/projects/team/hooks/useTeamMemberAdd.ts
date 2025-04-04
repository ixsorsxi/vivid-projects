
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { addTeamMemberToProject } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Hook for handling team member addition operations
 */
export const useTeamMemberAdd = (
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isAdding, setIsAdding] = useState(false);

  /**
   * Adds a team member to the project
   * @param member The member to add
   * @returns Promise that resolves to a boolean indicating success/failure
   */
  const handleAddMember = async (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    if (!projectId) {
      debugError('TEAM-OPS', 'No project ID provided for adding team member');
      throw new Error('Missing project ID');
    }
    
    setIsAdding(true);
    
    try {
      debugLog('TEAM-OPS', 'Adding team member to project:', projectId, member);
      
      // Use the API function to add the member
      const success = await addTeamMemberToProject(
        projectId,
        member.user_id,
        member.name,
        member.role,
        member.email
      );
      
      if (success) {
        debugLog('TEAM-OPS', 'Successfully added team member:', member.name);
        return true;
      } else {
        const errorMsg = 'Failed to add team member via API';
        debugError('TEAM-OPS', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      debugError('TEAM-OPS', 'Error in handleAddMember:', error);
      throw error; // Re-throw to allow proper error handling
    } finally {
      setIsAdding(false);
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        try {
          debugLog('TEAM-OPS', 'Refreshing team members after add operation');
          await refreshTeamMembers();
        } catch (refreshError) {
          debugError('TEAM-OPS', 'Error refreshing team members:', refreshError);
        }
      }
    }
  };

  return {
    isAdding,
    handleAddMember
  };
};
