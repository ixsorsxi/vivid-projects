
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { removeProjectTeamMember } from '@/api/projects/modules/team';

export const useTeamRemoveMember = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveMember = async (memberId: string | number): Promise<boolean> => {
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

  return {
    isRemoving,
    handleRemoveMember
  };
};
