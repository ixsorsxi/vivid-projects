
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { addProjectTeamMember } from '@/api/projects/modules/team';
import { useAuth } from '@/context/auth';

export const useTeamAddMember = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const { user } = useAuth();

  const handleAddMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    console.log('[HOOK] Adding team member with data:', member);
    
    if (projectId) {
      try {
        // Show immediate feedback by updating UI first
        const newMemberId = member.id || String(Date.now());
        const newMember: TeamMember = {
          id: newMemberId,
          name: member.name,
          role: member.role,
          user_id: member.user_id
        };
        
        console.log('[HOOK] Adding new team member to UI:', newMember);
        setTeamMembers(prev => [...prev, newMember]);
        
        // If we have a logged-in user, pass their ID for the operation to work with RLS
        const enhancedMember = {
          ...member,
          user_id: member.user_id || (user ? user.id : undefined)
        };
        
        console.log('[HOOK] Enhanced member data for API call:', enhancedMember);
        
        // Then attempt to save to database
        const success = await addProjectTeamMember(projectId, enhancedMember);
        
        if (success) {
          toast.success("Team member added", {
            description: `${member.name} has been added to the project team`,
          });
          
          // Then refresh to ensure we have the latest data
          if (refreshTeamMembers) {
            console.log('[HOOK] Refreshing team members after adding');
            await refreshTeamMembers();
          }
        } else {
          console.error('[HOOK] Failed to add team member through API');
          toast.error("Failed to add team member", {
            description: "There was an error adding the team member to the project. Please try again.",
          });
          
          // Revert UI update if API call failed and user can refresh
          if (refreshTeamMembers) {
            await refreshTeamMembers();
          } else {
            // If no refresh function, remove the temporarily added member
            setTeamMembers(prev => prev.filter(m => m.id !== newMemberId));
          }
        }
      } catch (error) {
        console.error('[HOOK] Error in handleAddMember:', error);
        toast.error("Error adding team member", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } else {
      // Local-only addition (no projectId)
      const newMember: TeamMember = {
        id: member.id || String(Date.now()),
        name: member.name,
        role: member.role,
        user_id: member.user_id
      };
      
      console.log('[HOOK] Adding team member locally (no projectId):', newMember);
      setTeamMembers([...teamMembers, newMember]);
      
      toast("Team member added", {
        description: `${member.name} has been added to the project team`,
      });
    }
  };

  return {
    handleAddMember
  };
};
