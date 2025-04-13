
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '@/api/projects/modules/team/types';
import { addProjectTeamMember, removeProjectTeamMember } from '@/api/projects/modules/team';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectTeamAccess } from '../useProjectTeamAccess';
import { debugLog, debugError } from '@/utils/debugLogger';

export const useTeamAccess = (projectId?: string) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  
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
    email?: string;
  }): Promise<boolean> => {
    if (!projectId) {
      const error = new Error('No project ID provided when adding team member');
      setLastError(error);
      debugError('TEAM-ACCESS', error.message);
      toast.error('Failed to add team member', {
        description: 'Missing project information'
      });
      return false;
    }
    
    // Ensure role is properly formatted for database storage
    const formattedRole = formatRoleForDb(member.role);
    
    setIsAddingMember(true);
    setLastError(null);
    
    try {
      debugLog('TEAM-ACCESS', 'Adding team member:', { ...member, role: formattedRole });
      
      // Call the API function to add the member
      const success = await addProjectTeamMember(projectId, {
        name: member.name,
        role: formattedRole, // Send the formatted role
        user_id: member.user_id,
        email: member.email
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
      debugError('TEAM-ACCESS', 'Error adding team member:', error);
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      setLastError(errorObj);
      
      // Show specific error for already being a member
      if (errorObj.message.includes('already a member')) {
        toast.error('User is already a team member', {
          description: 'This user is already a member of this project'
        });
      } else if (errorObj.message.includes('Permission denied')) {
        toast.error('Permission denied', {
          description: 'You do not have permission to add members to this project'
        });
      } else if (errorObj.message.includes('configuration issue')) {
        toast.error('Database configuration issue', {
          description: 'There is a problem with the database setup. Please try again later.'
        });
      } else {
        toast.error('Failed to add team member', {
          description: errorObj.message || 'An unexpected error occurred'
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
      const error = new Error('No project ID provided when removing team member');
      setLastError(error);
      debugError('TEAM-ACCESS', error.message);
      toast.error('Failed to remove team member', {
        description: 'Missing project information'
      });
      return false;
    }
    
    setIsRemovingMember(true);
    setLastError(null);
    
    try {
      debugLog('TEAM-ACCESS', 'Removing team member:', memberId);
      
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
      debugError('TEAM-ACCESS', 'Error removing team member:', error);
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      setLastError(errorObj);
      
      toast.error('Failed to remove team member', {
        description: errorObj.message || 'An unexpected error occurred'
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
    lastError,
    isAddingMember,
    isRemovingMember,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    formatRoleForDisplay
  };
};

export default useTeamAccess;
