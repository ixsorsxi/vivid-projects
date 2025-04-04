
import { useState } from 'react';
import { addTeamMemberToProject } from '@/api/projects/modules/team';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * Hook for adding team members
 */
export const useTeamMemberAdd = (projectId?: string, refreshTeamMembers?: () => Promise<void>) => {
  const [isAdding, setIsAdding] = useState(false);

  // Handle adding a team member
  const handleAddMember = async (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    console.log('useTeamMemberAdd - handleAddMember called with:', member);
    
    if (!projectId) {
      console.error('No project ID provided for adding team member');
      toast.error('Cannot add team member', {
        description: 'Project ID is missing'
      });
      return false;
    }
    
    setIsAdding(true);
    
    try {
      console.log('Adding team member to project:', projectId);
      
      // Normalize the project role - make sure we're not using system roles
      // Project roles should be independent of system roles
      const normalizedProjectRole = member.role || 'Team Member';
      
      // Use the wrapper function that handles role normalization
      const success = await addTeamMemberToProject(
        projectId,
        member.user_id,
        member.name,
        normalizedProjectRole,
        member.email
      );
      
      if (success) {
        console.log('Successfully added team member to project');
        
        // Refresh the team members to ensure we have the latest data
        if (refreshTeamMembers) {
          await refreshTeamMembers();
        }
        
        return true;
      } else {
        console.error('Failed to add team member to project');
        return false;
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isAdding,
    handleAddMember
  };
};
