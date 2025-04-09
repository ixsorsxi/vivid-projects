
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, debugError } from '@/utils/debugLogger';

export const useTeamManagerAssignment = (
  projectId: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const assignProjectManager = async (memberId: string): Promise<boolean> => {
    if (!projectId) {
      debugError('TeamManagerAssignment', 'No project ID provided for assigning project manager');
      toast.error('Unable to assign project manager', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      debugLog('TeamManagerAssignment', 'Assigning team member as project manager:', memberId, 'for project:', projectId);
      
      // First get the member details
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('user_id, project_member_name')
        .eq('id', memberId)
        .single();
      
      if (memberError) {
        debugError('TeamManagerAssignment', 'Error fetching project member:', memberError);
        throw memberError;
      }
      
      if (!memberData) {
        debugError('TeamManagerAssignment', 'Member not found:', memberId);
        toast.error('Failed to assign project manager', {
          description: 'Member not found'
        });
        return false;
      }
      
      // Update the member's role to Project Manager
      const { error: roleError } = await supabase
        .from('project_members')
        .update({ role: 'Project Manager' })
        .eq('id', memberId);
      
      if (roleError) {
        debugError('TeamManagerAssignment', 'Error updating member role:', roleError);
        throw roleError;
      }
      
      // Update other project members to be regular team members
      const { error: otherMembersError } = await supabase
        .from('project_members')
        .update({ role: 'team_member' })
        .eq('project_id', projectId)
        .neq('id', memberId)
        .in('role', ['Project Manager', 'project-manager']);
      
      if (otherMembersError) {
        debugError('TeamManagerAssignment', 'Error updating other members:', otherMembersError);
        // Non-fatal, continue
      }
      
      // If user_id is available, update the project's project_manager_id
      if (memberData.user_id) {
        const { error: projectError } = await supabase
          .from('projects')
          .update({ 
            project_manager_id: memberData.user_id,
            project_manager_name: memberData.project_member_name 
          })
          .eq('id', projectId);
        
        if (projectError) {
          debugError('TeamManagerAssignment', 'Error updating project manager:', projectError);
          throw projectError;
        }
      }
      
      toast.success('Project manager assigned', {
        description: `The team member has been assigned as project manager.`
      });
      
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
      }
      
      return true;
    } catch (error) {
      debugError('TeamManagerAssignment', 'Error in assignProjectManager:', error);
      toast.error('Error assigning project manager', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    assignProjectManager
  };
};
