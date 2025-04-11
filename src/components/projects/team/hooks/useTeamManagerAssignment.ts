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
      
      // Get the project_manager role ID
      const { data: roleData, error: roleError } = await supabase
        .from('project_roles')
        .select('id')
        .eq('role_key', 'project_manager')
        .single();
      
      if (roleError || !roleData) {
        debugError('TeamManagerAssignment', 'Error getting project manager role:', roleError);
        throw roleError || new Error('Project manager role not found');
      }
      
      // Assign the role to the user in user_project_roles
      if (memberData.user_id) {
        const { error: roleAssignError } = await supabase
          .from('user_project_roles')
          .upsert({
            user_id: memberData.user_id,
            project_id: projectId,
            project_role_id: roleData.id
          }, {
            onConflict: 'user_id, project_id',
            ignoreDuplicates: false
          });
        
        if (roleAssignError) {
          debugError('TeamManagerAssignment', 'Error updating member role:', roleAssignError);
          throw roleAssignError;
        }
      }
      
      // Update other project members to be regular team members
      // This is now handled in the user_project_roles table
      
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
