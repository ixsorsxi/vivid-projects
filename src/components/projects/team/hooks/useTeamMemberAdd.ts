
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
   * Checks if a user is already a member of the project
   */
  const checkExistingMember = async (userId?: string, email?: string): Promise<boolean> => {
    if (!projectId) return false;
    
    try {
      // Check by user_id if provided
      if (userId) {
        const { data, error } = await supabase
          .from('project_members')
          .select('id')
          .eq('project_id', projectId)
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error) {
          debugError('TEAM-OPS', 'Error checking existing member by user_id:', error);
        }
        
        if (data) {
          debugLog('TEAM-OPS', 'User already exists in project:', data);
          return true;
        }
      }
      
      // Check by email if provided
      if (email) {
        // First check if there's a profile with this email that has a membership
        const { data: existingMembers, error: memberError } = await supabase
          .from('project_members')
          .select('id, project_member_name')
          .eq('project_id', projectId)
          .eq('project_member_name', email.split('@')[0])
          .is('user_id', null);
          
        if (memberError) {
          debugError('TEAM-OPS', 'Error checking existing member by email:', memberError);
        }
        
        if (existingMembers && existingMembers.length > 0) {
          debugLog('TEAM-OPS', 'Email already invited to project:', existingMembers);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      debugError('TEAM-OPS', 'Error in checkExistingMember:', error);
      return false;
    }
  };

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
      throw error;
    }
    
    setIsAdding(true);
    setLastError(null);
    
    try {
      debugLog('TEAM-OPS', 'Adding team member to project:', projectId, member);
      
      // Check if member already exists in the project
      const alreadyExists = await checkExistingMember(member.user_id, member.email);
      if (alreadyExists) {
        const errorMsg = "This user is already a member of this project";
        debugError('TEAM-OPS', errorMsg);
        const error = new Error(errorMsg);
        setLastError(error);
        throw error;
      }
      
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
        throw error;
      }
    } catch (error) {
      debugError('TEAM-OPS', 'Error in handleAddMember:', error);
      
      setLastError(error instanceof Error ? error : new Error('Unknown error'));
      
      // Extract meaningful error message for toast
      let errorMessage = 'Unknown error occurred while adding team member';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle specific error cases
        if (errorMessage.includes('duplicate')) {
          errorMessage = 'This user is already a member of this project';
        } else if (errorMessage.includes('already a member')) {
          // Keep the message as is, it's already descriptive
        }
      }
      
      toast.error('Failed to add team member', {
        description: errorMessage
      });
      
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
    lastError,
    handleAddMember
  };
};
