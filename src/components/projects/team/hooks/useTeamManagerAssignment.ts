
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';

/**
 * Hook for assigning project manager role
 */
export const useTeamManagerAssignment = (
  teamMembers: TeamMember[],
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle assigning a project manager
  const assignProjectManager = async (memberId: string | number): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided for assigning project manager');
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      // Find the member to promote
      const memberToPromote = teamMembers.find(m => String(m.id) === String(memberId));
      
      if (!memberToPromote) {
        console.error('Member not found with ID:', memberId);
        return false;
      }
      
      // Update the project's project_manager_id field
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          project_manager_id: memberToPromote.user_id
        })
        .eq('id', projectId);
      
      if (updateError) {
        console.error('Error updating project manager:', updateError);
        toast.error('Failed to assign project manager', {
          description: 'There was an issue setting the project manager.'
        });
        return false;
      }
      
      // Update the member's role to Project Manager and reset other members
      const { error: memberError } = await supabase
        .from('project_members')
        .update({ role: 'Project Manager' })
        .eq('id', String(memberId))
        .eq('project_id', projectId);
      
      if (memberError) {
        console.error('Error updating member role:', memberError);
      }
      
      // Reset other project managers to Team Member
      const { error: resetError } = await supabase
        .from('project_members')
        .update({ role: 'Team Member' })
        .neq('id', String(memberId))
        .eq('project_id', projectId)
        .eq('role', 'Project Manager');
      
      if (resetError) {
        console.error('Error resetting other project managers:', resetError);
      }
      
      toast.success('Project manager assigned', {
        description: `${memberToPromote.name} has been assigned as the project manager.`
      });
      
      // Refresh team members to ensure we have the latest data
      if (refreshTeamMembers) {
        await refreshTeamMembers();
      }
      
      return true;
    } catch (error) {
      console.error('Error assigning project manager:', error);
      toast.error('Error assigning project manager', {
        description: 'An unexpected error occurred.'
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
