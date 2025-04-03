import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { addProjectTeamMember, removeProjectTeamMember } from '@/api/projects/modules/team';
import { supabase } from '@/integrations/supabase/client';

export const useTeamOperations = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle adding a team member
  const handleAddMember = async (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }) => {
    if (!projectId) {
      console.error('[TEAM-OPS] No project ID provided for adding team member');
      return false;
    }
    
    setIsAdding(true);
    
    try {
      console.log('[TEAM-OPS] Adding team member to project:', projectId, member);
      
      // Create a temporary member for UI feedback before API completes
      const tempId = `temp-${Date.now()}`;
      const newMember: TeamMember = {
        id: tempId,
        name: member.name,
        role: member.role,
        user_id: member.user_id
      };
      
      // Update UI immediately for responsive feedback
      setTeamMembers(prev => [...prev, newMember]);
      
      // Use the API function to add the member
      const success = await addProjectTeamMember(projectId, member);
      
      if (success) {
        toast.success('Team member added', {
          description: `${member.name} has been added to the project.`
        });
        
        // If we have a refresh function, use it to get the server's version with correct IDs
        if (refreshTeamMembers) {
          console.log('[TEAM-OPS] Refreshing team members after successful add');
          await refreshTeamMembers();
        }
        
        return true;
      } else {
        // Remove the temporary member if API call failed
        setTeamMembers(prev => prev.filter(m => m.id !== tempId));
        
        toast.error('Error adding team member', {
          description: 'There was a problem adding the team member. Please try again.'
        });
        return false;
      }
    } catch (error) {
      console.error('[TEAM-OPS] Error in handleAddMember:', error);
      toast.error('Error adding team member', {
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Handle removing a team member
  const handleRemoveMember = async (memberId: string | number) => {
    if (!projectId) {
      console.error('[TEAM-OPS] No project ID provided for removing team member');
      return false;
    }
    
    const stringMemberId = String(memberId);
    const memberToRemove = teamMembers.find(m => String(m.id) === stringMemberId);
    
    if (!memberToRemove) {
      console.error('[TEAM-OPS] Member not found with ID:', stringMemberId);
      return false;
    }
    
    setIsRemoving(true);
    
    try {
      console.log('[TEAM-OPS] Removing team member from project:', projectId, stringMemberId);
      
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
      console.error('[TEAM-OPS] Error in handleRemoveMember:', error);
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
      
      // First, update the member's role to Project Manager
      const { error: roleError } = await supabase
        .from('project_members')
        .update({ role: 'Project Manager' })
        .eq('id', stringMemberId)
        .eq('project_id', projectId);
      
      if (roleError) {
        console.error('[TEAM-OPS] Error updating member role:', roleError);
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
      
      // Update local state
      setTeamMembers(prev => prev.map(m => 
        String(m.id) === stringMemberId 
          ? { ...m, role: 'Project Manager' } 
          : (m.role === 'Project Manager' ? { ...m, role: 'Member' } : m)
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
    isAdding,
    isRemoving,
    isUpdating,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  };
};
