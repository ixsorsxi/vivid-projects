
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { addTeamMemberToProject } from '@/api/projects/modules/team';

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
      console.log('Adding team member to project:', projectId, member);
      
      // Use the API function to add the member
      const success = await addTeamMemberToProject(
        projectId,
        member.user_id,
        member.name,
        member.role,
        member.email
      );
      
      if (success) {
        console.log(`Successfully added ${member.name} to project`);
        return true;
      } else {
        console.error(`Failed to add ${member.name} to project via API`);
        return false;
      }
    } catch (error) {
      console.error('Error in addTeamMember:', error);
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
