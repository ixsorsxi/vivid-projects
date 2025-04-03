
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../../types';
import { addProjectTeamMember } from '@/api/projects/modules/team';

export const useTeamAddMember = (
  teamMembers: TeamMember[],
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  projectId?: string,
  refreshTeamMembers?: () => Promise<void>
) => {
  const [isAdding, setIsAdding] = useState(false);

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
      console.log('[OPERATIONS] Adding team member to project:', projectId, member);
      
      // Use the API function to add the member
      const success = await addProjectTeamMember(projectId, member);
      
      if (success) {
        // Create a new team member object
        const newMember: TeamMember = {
          id: member.id || String(Date.now()),
          name: member.name,
          role: member.role,
          user_id: member.user_id
        };
        
        // Update local state
        setTeamMembers(prev => [...prev, newMember]);
        
        toast.success('Team member added', {
          description: `${member.name} has been added to the project.`
        });
        
        return true;
      } else {
        toast.error('Error adding team member', {
          description: 'There was a problem adding the team member. Please try again.'
        });
        return false;
      }
    } catch (error) {
      console.error('[OPERATIONS] Error in handleAddMember:', error);
      toast.error('Error adding team member', {
        description: 'An unexpected error occurred.'
      });
      return false;
    } finally {
      setIsAdding(false);
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
    handleAddMember
  };
};
