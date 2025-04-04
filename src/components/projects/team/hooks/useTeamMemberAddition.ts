
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { SystemUser } from '../types';
import { addTeamMemberToProject } from '@/api/projects/modules/team/teamOperations';

export const useTeamMemberAddition = (projectId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addTeamMember = async (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided for team member addition');
      toast.error('Cannot add team member', {
        description: 'Missing project information'
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Adding team member:', member);
      
      // Use the API function to add the member
      const success = await addTeamMemberToProject(
        projectId,
        member.user_id,
        member.name,
        member.role,
        member.email
      );
      
      if (success) {
        toast.success('Team member added', {
          description: `${member.name} has been added to the project`
        });
        return true;
      } else {
        toast.error('Failed to add team member', {
          description: 'There was a problem adding the team member'
        });
        return false;
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Error adding team member', {
        description: 'An unexpected error occurred'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to add existing user from the system
  const addExistingUser = async (user: SystemUser): Promise<boolean> => {
    return addTeamMember({
      name: user.name,
      role: user.role || 'Team Member',
      email: user.email,
      user_id: String(user.id)
    });
  };
  
  // Helper function to add external user by email
  const addExternalMember = async (email: string, role: string): Promise<boolean> => {
    return addTeamMember({
      name: email.split('@')[0], // Use part of email as name
      role,
      email
    });
  };

  return {
    isSubmitting,
    addTeamMember,
    addExistingUser,
    addExternalMember
  };
};
