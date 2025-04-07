
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { addTeamMemberToProject } from '@/api/projects/modules/team';
import { debugLog, debugError } from '@/utils/debugLogger';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for handling team member addition operations
 */
export const useTeamMemberAdd = (
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

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
      const error = new Error('Missing project ID');
      setLastError(error);
      toast.error('Error', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsAdding(true);
    setLastError(null);
    
    try {
      debugLog('TEAM-OPS', 'Adding team member to project:', projectId, member);
      
      // Check if supabase client is initialized
      if (!supabase) {
        const error = new Error('Supabase client is not initialized');
        debugError('TEAM-OPS', error.message);
        setLastError(error);
        toast.error('Error', {
          description: 'Database client is not initialized properly'
        });
        return false;
      }

      // Log current authentication status
      const { data: authData } = await supabase.auth.getUser();
      debugLog('TEAM-OPS', 'Current auth user:', authData?.user?.id || 'Not authenticated');
      
      // Ensure user_id is properly formatted as a string if provided
      const userId = member.user_id ? String(member.user_id) : undefined;
      
      // Use the API function to add the member
      const success = await addTeamMemberToProject(
        projectId,
        userId,
        member.name,
        member.role,
        member.email
      );
      
      if (success) {
        debugLog('TEAM-OPS', 'Successfully added team member:', member.name);
        toast.success('Team member added', {
          description: `${member.name} has been added to the project`
        });
        return true;
      } else {
        const errorMsg = 'Failed to add team member via API';
        debugError('TEAM-OPS', errorMsg);
        const error = new Error(errorMsg);
        setLastError(error);
        toast.error('Failed to add team member', {
          description: 'An unknown error occurred'
        });
        return false;
      }
    } catch (error) {
      debugError('TEAM-OPS', 'Error in handleAddMember:', error);
      
      setLastError(error instanceof Error ? error : new Error('Unknown error'));
      
      // Extract meaningful error message for toast
      let errorMessage = 'Unknown error occurred while adding team member';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle specific error cases
        if (errorMessage.includes('duplicate') || errorMessage.includes('already a member')) {
          errorMessage = 'This user is already a member of this project';
        }
      }
      
      toast.error('Failed to add team member', {
        description: errorMessage
      });
      
      return false;
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
    lastError,
    handleAddMember
  };
};
