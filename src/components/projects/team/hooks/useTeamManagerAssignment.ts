
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

/**
 * Hook for handling project manager assignment operations
 */
export const useTeamManagerAssignment = (
  teamMembers: TeamMember[],
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Assigns a team member as project manager
   * @param memberId The ID of the member to assign as manager
   * @returns Promise that resolves to a boolean indicating success/failure
   */
  const assignProjectManager = async (memberId: string | number): Promise<boolean> => {
    if (!projectId) {
      debugError('useTeamManagerAssignment', 'No project ID provided');
      toast.error('Unable to assign project manager', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      const stringMemberId = String(memberId);
      const memberToPromote = teamMembers.find(m => String(m.id) === stringMemberId);
      
      if (!memberToPromote) {
        debugError('useTeamManagerAssignment', 'Member not found with ID:', stringMemberId);
        return false;
      }
      
      debugLog('useTeamManagerAssignment', 'Assigning project manager:', memberToPromote.name);
      
      // First, demote any existing project managers in this project
      await supabase
        .from('project_members')
        .update({ role: 'team_member' })
        .eq('project_id', projectId)
        .eq('role', 'Project Manager');
      
      // Then, update the selected member's role to Project Manager
      const { error: roleError } = await supabase
        .from('project_members')
        .update({ role: 'Project Manager' })
        .eq('id', stringMemberId);
      
      if (roleError) {
        debugError('useTeamManagerAssignment', 'Error updating member role:', roleError);
        return false;
      }
      
      // Finally, update the project record with the new project manager info
      if (memberToPromote.user_id) {
        const { error: projectError } = await supabase
          .from('projects')
          .update({ 
            project_manager_id: memberToPromote.user_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);
        
        if (projectError) {
          debugError('useTeamManagerAssignment', 'Error updating project manager id:', projectError);
          // Continue anyway as the role has been updated
        }
      }
      
      toast.success('Project manager assigned', {
        description: `${memberToPromote.name} has been assigned as the project manager`
      });
      
      return true;
    } catch (error) {
      debugError('useTeamManagerAssignment', 'Error:', error);
      toast.error('Error assigning project manager', {
        description: 'An unexpected error occurred'
      });
      return false;
    } finally {
      setIsUpdating(false);
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
      }
    }
  };

  return {
    isUpdating,
    assignProjectManager
  };
};
