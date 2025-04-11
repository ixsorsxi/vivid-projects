import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { supabase } from '@/integrations/supabase/client';

export const useTeamManagerAssign = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to assign a team member as project manager
  const assignProjectManager = async (memberId: string | number): Promise<boolean> => {
    if (!projectId) {
      console.error('[TEAM-OPS] No project ID provided for assigning project manager');
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      const stringMemberId = String(memberId);
      const memberToPromote = teamMembers.find(m => String(m.id) === stringMemberId);
      
      if (!memberToPromote) {
        console.error('[TEAM-OPS] Member not found with ID:', stringMemberId);
        return false;
      }
      
      console.log('[TEAM-OPS] Assigning project manager:', memberToPromote.name);
      
      // Get the project_manager role ID
      const { data: roleData, error: roleError } = await supabase
        .from('project_roles')
        .select('id')
        .eq('role_key', 'project_manager')
        .single();
      
      if (roleError || !roleData) {
        console.error('[TEAM-OPS] Error getting project manager role:', roleError);
        return false;
      }
      
      // Assign the role to the user
      const { error: assignError } = await supabase
        .from('user_project_roles')
        .upsert({
          user_id: memberToPromote.user_id,
          project_id: projectId,
          project_role_id: roleData.id
        }, {
          onConflict: 'user_id, project_id',
          ignoreDuplicates: false
        });
      
      if (assignError) {
        console.error('[TEAM-OPS] Error assigning role:', assignError);
        return false;
      }
      
      // Then, update the project's project_manager_id if user_id is available
      if (memberToPromote.user_id) {
        const { error: projectError } = await supabase
          .from('projects')
          .update({ project_manager_id: memberToPromote.user_id })
          .eq('id', projectId);
        
        if (projectError) {
          console.error('[TEAM-OPS] Error updating project manager:', projectError);
          return false;
        }
      }
      
      // Update local state - only one person can be a Project Manager at a time
      setTeamMembers(prev => prev.map(m => 
        String(m.id) === stringMemberId 
          ? { ...m, role: 'project_manager' } 
          : (m.role === 'project_manager' ? { ...m, role: 'team_member' } : m)
      ));
      
      toast.success('Project manager assigned', {
        description: `${memberToPromote.name} has been assigned as the project manager.`
      });
      
      return true;
    } catch (error) {
      console.error('[TEAM-OPS] Error assigning project manager:', error);
      toast.error('Error assigning project manager', {
        description: 'An unexpected error occurred.'
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
