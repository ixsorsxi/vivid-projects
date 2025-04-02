
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
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    if (isAdding) return;
    
    setIsAdding(true);
    console.log('[HOOK] Adding team member with data:', member);
    
    try {
      // Create a temporary member ID for immediate UI feedback
      const newMemberId = member.id || String(Date.now());
      const newMember: TeamMember = {
        id: newMemberId,
        name: member.name,
        role: member.role,
        user_id: member.user_id
      };
      
      // Update UI first for immediate feedback
      console.log('[HOOK] Adding new team member to UI:', newMember);
      setTeamMembers(prev => [...prev, newMember]);
      
      if (projectId) {
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
          
          // Revert UI update if API call failed
          setTeamMembers(prev => prev.filter(m => m.id !== newMemberId));
        }
      } else {
        // Local-only addition (no projectId)
        toast.success("Team member added", {
          description: `${member.name} has been added to the project team`,
        });
      }
    } catch (error) {
      console.error('[HOOK] Error in handleAddMember:', error);
      toast.error("Error adding team member", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isAdding,
    handleAddMember
  };
};
