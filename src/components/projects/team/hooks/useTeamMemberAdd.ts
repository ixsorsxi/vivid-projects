
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { addTeamMemberToProject } from '@/api/projects/modules/team';

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
      console.error('[TEAM-OPS] No project ID provided for adding team member');
      toast.error('Unable to add team member', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsAdding(true);
    
    try {
      console.log('[TEAM-OPS] Adding team member to project:', projectId, member);
      
      // Use the API function to add the member
      const success = await addTeamMemberToProject(
        projectId,
        member.user_id,
        member.name,
        member.role,
        member.email
      );
      
      if (success) {
        console.log('[TEAM-OPS] Successfully added team member:', member.name);
        return true;
      } else {
        console.error('[TEAM-OPS] Failed to add team member via API');
        return false;
      }
    } catch (error) {
      console.error('[TEAM-OPS] Error in handleAddMember:', error);
      return false;
    } finally {
      setIsAdding(false);
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        try {
          console.log('[TEAM-OPS] Refreshing team members after add operation');
          await refreshTeamMembers();
        } catch (refreshError) {
          console.error('[TEAM-OPS] Error refreshing team members:', refreshError);
        }
      }
    }
  };

  return {
    isAdding,
    handleAddMember
  };
};
