
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';
import { supabase } from '@/integrations/supabase/client';

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
   * Assigns a team member as the project manager
   * @param memberId The ID of the member to assign as project manager
   * @returns Promise that resolves to a boolean indicating success/failure
   */
  const assignProjectManager = async (memberId: string): Promise<boolean> => {
    if (!projectId) {
      console.error('[TEAM-OPS] No project ID provided for assigning project manager');
      toast.error('Unable to update project manager', {
        description: 'No project ID was provided'
      });
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      console.log('[TEAM-OPS] Assigning project manager for project:', projectId, 'memberId:', memberId);
      
      // Find the member being promoted
      const memberToPromote = teamMembers.find(m => m.id === memberId);
      
      if (!memberToPromote) {
        console.error('[TEAM-OPS] Member not found with ID:', memberId);
        toast.error('Unable to update project manager', {
          description: 'Selected team member not found'
        });
        return false;
      }
      
      // Get the project manager role ID
      const { data: projectManagerRole, error: roleError } = await supabase
        .from('project_roles')
        .select('id')
        .eq('role_key', 'project_manager')
        .maybeSingle();
        
      if (roleError || !projectManagerRole) {
        console.error('[TEAM-OPS] Error getting project manager role:', roleError);
        toast.error('Unable to update project manager', {
          description: 'Project manager role not found'
        });
        return false;
      }
      
      // First, update the member's role to Project Manager
      const { error: memberError } = await supabase
        .from('project_members')
        .update({ 
          role: 'Project Manager'
          // After the migration is applied, uncomment this:
          // project_role_id: projectManagerRole.id
        })
        .eq('id', memberId);
      
      if (memberError) {
        console.error('[TEAM-OPS] Error updating member role:', memberError);
        toast.error('Unable to update team member role', {
          description: memberError.message
        });
        return false;
      }
      
      // Next, update the project's project_manager_id field
      if (memberToPromote.user_id) {
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            project_manager_id: memberToPromote.user_id,
            project_manager_name: memberToPromote.name
          })
          .eq('id', projectId);
        
        if (projectError) {
          console.error('[TEAM-OPS] Error updating project manager:', projectError);
          toast.error('Unable to update project manager', {
            description: projectError.message
          });
          return false;
        }
      }
      
      // Finally, update all other members to make sure only one has the Project Manager role
      const { data: teamMemberRole } = await supabase
        .from('project_roles')
        .select('id')
        .eq('role_key', 'team_member')
        .maybeSingle();
        
      if (teamMemberRole) {
        const { error: updateError } = await supabase
          .from('project_members')
          .update({ 
            role: 'Team Member'
            // After the migration is applied, uncomment this:
            // project_role_id: teamMemberRole.id
          })
          .eq('project_id', projectId)
          .neq('id', memberId)
          .eq('role', 'Project Manager');
        
        if (updateError) {
          console.error('[TEAM-OPS] Error updating other members:', updateError);
        }
      }
      
      console.log('[TEAM-OPS] Successfully assigned project manager:', memberToPromote.name);
      toast.success('Project manager updated', {
        description: `${memberToPromote.name} is now the project manager`
      });
      
      return true;
    } catch (error) {
      console.error('[TEAM-OPS] Error in assignProjectManager:', error);
      toast.error('Error updating project manager', {
        description: 'An unexpected error occurred'
      });
      return false;
    } finally {
      setIsUpdating(false);
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        try {
          console.log('[TEAM-OPS] Refreshing team members after update operation');
          await refreshTeamMembers();
        } catch (refreshError) {
          console.error('[TEAM-OPS] Error refreshing team members:', refreshError);
        }
      }
    }
  };

  return {
    isUpdating,
    assignProjectManager
  };
};
