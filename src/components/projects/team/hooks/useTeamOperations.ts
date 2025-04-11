import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';
import { removeProjectTeamMember } from '@/api/projects/modules/team';
import { supabase } from '@/integrations/supabase/client';

export const useTeamOperations = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemoveMember = async (memberId: string | number) => {
    if (!projectId) {
      console.error('No project ID provided for removing team member');
      return false;
    }
    
    const stringMemberId = String(memberId);
    const memberToRemove = teamMembers.find(m => String(m.id) === stringMemberId);
    
    if (!memberToRemove) {
      console.error('Member not found with ID:', stringMemberId);
      return false;
    }
    
    setIsRemoving(true);
    
    try {
      console.log('[OPERATIONS] Removing team member from project:', projectId, stringMemberId);
      
      // Use the API function to remove the member
      const success = await removeProjectTeamMember(projectId, stringMemberId);
      
      if (success) {
        // Update local state
        setTeamMembers(prev => prev.filter(m => String(m.id) !== stringMemberId));
        
        toast.success('Team member removed', {
          description: `${memberToRemove.name} has been removed from the project.`
        });
        
        return true;
      } else {
        toast.error('Error removing team member', {
          description: 'There was a problem removing the team member. Please try again.'
        });
        return false;
      }
    } catch (error) {
      console.error('[OPERATIONS] Error in handleRemoveMember:', error);
      toast.error('Error removing team member', {
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsRemoving(false);
      // Refresh team members if a refresh function is provided
      if (refreshTeamMembers) {
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
      }
    }
  };

  // Function to assign a team member as project manager
  const assignProjectManager = async (memberId: string | number) => {
    if (!projectId) {
      console.error('No project ID provided for assigning project manager');
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      const stringMemberId = String(memberId);
      const memberToPromote = teamMembers.find(m => String(m.id) === stringMemberId);
      
      if (!memberToPromote) {
        console.error('Member not found with ID:', stringMemberId);
        return false;
      }
      
      console.log('[OPERATIONS] Assigning project manager:', memberToPromote.name);
      
      // Get the project_manager role ID
      const { data: roleData, error: roleError } = await supabase
        .from('project_roles')
        .select('id')
        .eq('role_key', 'project_manager')
        .single();
      
      if (roleError || !roleData) {
        console.error('[OPERATIONS] Error getting project manager role:', roleError);
        return false;
      }
      
      // Assign the role to the user in user_project_roles
      if (memberToPromote.user_id) {
        const { error: roleAssignError } = await supabase
          .from('user_project_roles')
          .upsert({
            user_id: memberToPromote.user_id,
            project_id: projectId,
            project_role_id: roleData.id
          }, {
            onConflict: 'user_id, project_id',
            ignoreDuplicates: false
          });
        
        if (roleAssignError) {
          console.error('[OPERATIONS] Error updating member role:', roleAssignError);
          return false;
        }
      }
      
      // Update the project's project_manager_id
      const { error: projectError } = await supabase
        .from('projects')
        .update({ project_manager_id: memberToPromote.user_id })
        .eq('id', projectId);
      
      if (projectError) {
        console.error('[OPERATIONS] Error updating project manager:', projectError);
        return false;
      }
      
      // Update local state
      setTeamMembers(prev => prev.map(m => 
        String(m.id) === stringMemberId 
          ? { ...m, role: 'project_manager' } 
          : m
      ));
      
      toast.success('Project manager assigned', {
        description: `${memberToPromote.name} has been assigned as the project manager.`
      });
      
      return true;
    } catch (error) {
      console.error('[OPERATIONS] Error assigning project manager:', error);
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
    isRemoving,
    isUpdating,
    handleRemoveMember,
    assignProjectManager
  };
};
