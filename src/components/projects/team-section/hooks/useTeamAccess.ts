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
  
  // Helper function to standardize role format for the database
  const formatRoleForDb = (role: string): string => {
    return role.toLowerCase().replace(/[\s-]+/g, '_');
  };
  
  // Helper function to format role for display
  const formatRoleForDisplay = (role: string): string => {
    if (!role) return 'Team Member';
    
    return role
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
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
    
    // Ensure role is properly formatted for database storage
    const formattedRole = formatRoleForDb(member.role);
    
    setIsAddingMember(true);
    
    try {
      console.log('Adding team member:', { ...member, role: formattedRole });
      
      // Call the API function to add the member
      const success = await addProjectTeamMember(projectId, {
        name: member.name,
        role: formattedRole, // Send the formatted role
        user_id: member.user_id
      });
      
      if (success) {
        toast.success('Team member added', {
          description: `${member.name} has been added to the project`
        });
        
        // Refresh the team members list
        await refreshTeamMembers();
        
        return true;
      } else {
        toast.error('Failed to add team member', {
          description: 'The operation was unsuccessful'
        });
        return false;
      }
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
    handleRemoveMember,
    formatRoleForDisplay
  };
};

export default useTeamAccess;
