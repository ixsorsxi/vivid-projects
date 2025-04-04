
import { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';
import { fetchProjectTeamMembers } from '@/api/projects/modules/team/fetchTeamMembers';
import { addProjectTeamMember, removeProjectTeamMember } from '@/api/projects/modules/team';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing team members for a project
 */
export const useTeamMembers = (initialMembers: TeamMember[] = [], projectId?: string) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialMembers);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch team members from the API
  const refreshTeamMembers = useCallback(async () => {
    if (!projectId) {
      console.warn('No project ID provided for fetching team members');
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      console.log('Fetching team members for project:', projectId);
      const members = await fetchProjectTeamMembers(projectId);
      
      if (Array.isArray(members)) {
        console.log('Fetched team members:', members);
        setTeamMembers(members);
      } else {
        console.error('Invalid response from fetchProjectTeamMembers:', members);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  // Initial fetch of team members
  useEffect(() => {
    if (projectId) {
      refreshTeamMembers();
    }
  }, [projectId, refreshTeamMembers]);

  // Handle adding a team member
  const handleAddMember = async (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided for adding team member');
      return false;
    }
    
    setIsAdding(true);
    
    try {
      console.log('Adding team member to project:', projectId);
      console.log('Member data:', member);
      
      // Use the API function to add the member
      const success = await addProjectTeamMember(projectId, member);
      
      if (success) {
        console.log('Successfully added team member to project');
        
        // Refresh the team members to ensure we have the latest data
        await refreshTeamMembers();
        
        return true;
      } else {
        console.error('Failed to add team member to project');
        toast.error('Failed to add team member', {
          description: 'There was an issue adding the team member to the project.'
        });
        return false;
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Error adding team member', {
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Handle removing a team member
  const handleRemoveMember = async (memberId: string | number): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided for removing team member');
      return false;
    }
    
    setIsRemoving(true);
    
    try {
      // Find the member to be removed for better user feedback
      const memberToRemove = teamMembers.find(m => String(m.id) === String(memberId));
      
      const success = await removeProjectTeamMember(projectId, String(memberId));
      
      if (success) {
        // Update local state
        setTeamMembers(prev => prev.filter(m => String(m.id) !== String(memberId)));
        
        if (memberToRemove) {
          toast.success('Team member removed', {
            description: `${memberToRemove.name} has been removed from the project.`
          });
        }
        
        return true;
      } else {
        toast.error('Failed to remove team member', {
          description: 'There was an issue removing the team member from the project.'
        });
        return false;
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Error removing team member', {
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsRemoving(false);
    }
  };

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
      
      // Update local state
      const updatedMembers = teamMembers.map(m => {
        if (String(m.id) === String(memberId)) {
          return { ...m, role: 'Project Manager' };
        } else if (m.role === 'Project Manager') {
          return { ...m, role: 'Team Member' };
        }
        return m;
      });
      
      setTeamMembers(updatedMembers);
      
      toast.success('Project manager assigned', {
        description: `${memberToPromote.name} has been assigned as the project manager.`
      });
      
      // Refresh team members to ensure we have the latest data
      await refreshTeamMembers();
      
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
    teamMembers,
    isRefreshing,
    isAdding,
    isRemoving,
    isUpdating,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  };
};
