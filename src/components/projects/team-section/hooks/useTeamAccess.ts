
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '@/api/projects/modules/team/types';
import { addProjectTeamMember, removeProjectTeamMember } from '@/api/projects/modules/team';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectTeamAccess } from '../useProjectTeamAccess';

export const useTeamAccess = (projectId?: string) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  
  // Use our project team access hook for fetching team data
  const {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    refreshTeamMembers
  } = useProjectTeamAccess(projectId);
  
  // Handler for adding a new team member
  const handleAddMember = useCallback(async (member: { 
    name: string; 
    role: string; 
    user_id: string;
  }): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided when adding team member');
      toast.error('Failed to add team member', {
        description: 'Missing project information'
      });
      return false;
    }
    
    // Ensure role is properly formatted (lowercase with underscores)
    const formattedRole = member.role.toLowerCase().replace(/[\s-]+/g, '_');
    
    setIsAddingMember(true);
    
    try {
      console.log('Adding team member:', { ...member, role: formattedRole });
      
      // Call the API function to add the member
      const success = await addProjectTeamMember(projectId, {
        name: member.name,
        role: formattedRole, // Send the formatted role
        user_id: member.user_id
      });
      
      // Refresh the team members list
      await refreshTeamMembers();
      
      return success;
    } catch (error) {
      console.error('Error adding team member:', error);
      
      // Show specific error for already being a member
      if (error instanceof Error) {
        if (error.message.includes('already a member')) {
          toast.error('User is already a team member', {
            description: 'This user is already a member of this project'
          });
        } else {
          toast.error('Failed to add team member', {
            description: error.message
          });
        }
      } else {
        toast.error('Failed to add team member', {
          description: 'An unexpected error occurred'
        });
      }
      
      return false;
    } finally {
      setIsAddingMember(false);
    }
  }, [projectId, refreshTeamMembers]);

  // Handler for removing a team member
  const handleRemoveMember = useCallback(async (memberId: string): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided when removing team member');
      toast.error('Failed to remove team member', {
        description: 'Missing project information'
      });
      return false;
    }
    
    setIsRemovingMember(true);
    
    try {
      console.log('Removing team member:', memberId);
      
      // Call the API function to remove the member
      const success = await removeProjectTeamMember(projectId, memberId);
      
      if (success) {
        toast.success('Team member removed', {
          description: 'The team member has been removed from the project'
        });
        
        // Refresh the team members list
        await refreshTeamMembers();
        
        return true;
      } else {
        toast.error('Failed to remove team member', {
          description: 'The operation was unsuccessful'
        });
        return false;
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      
      toast.error('Failed to remove team member', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      
      return false;
    } finally {
      setIsRemovingMember(false);
    }
  }, [projectId, refreshTeamMembers]);

  return {
    teamMembers,
    isLoading,
    hasAccess,
    error,
    isAddingMember,
    isRemovingMember,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember
  };
};

export default useTeamAccess;
