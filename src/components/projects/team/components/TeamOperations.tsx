
import React from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { TeamMember } from '../types';

interface TeamOperationsProps {
  projectId?: string;
  refreshTeamMembers: () => Promise<void>;
  handleAddMember: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
  handleRemoveMember: (id: string | number) => Promise<boolean>;
  handleMakeManager: (id: string | number) => Promise<boolean>;
  onExternalAddMember?: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => void;
  onExternalRemoveMember?: (id: string | number) => void;
  onExternalMakeManager?: (id: string | number) => void;
}

export const useTeamOperations = (props: TeamOperationsProps) => {
  const {
    projectId,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    handleMakeManager,
    onExternalAddMember,
    onExternalRemoveMember,
    onExternalMakeManager
  } = props;

  const addMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }): Promise<boolean> => {
    console.log('Adding member in TeamOperations:', member);
    
    try {
      if (onExternalAddMember) {
        onExternalAddMember(member);
        return true;
      } 
      
      const success = await handleAddMember(member);
      
      if (success) {
        toast.success("Team member added", {
          description: `${member.name} has been added to the project team.`
        });
        
        if (projectId) {
          console.log("Forcing refresh after adding team member");
          await refreshTeamMembers();
        }
        return true;
      } else {
        toast.error("Failed to add team member", {
          description: "There was an issue adding the team member. Please try again."
        });
        return false;
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Error adding team member", {
        description: "An unexpected error occurred."
      });
      return false;
    }
  };

  const removeMember = async (id: string | number): Promise<boolean> => {
    try {
      if (onExternalRemoveMember) {
        onExternalRemoveMember(id);
        return true;
      } else {
        const success = await handleRemoveMember(id);
        
        if (projectId && success) {
          setTimeout(() => {
            refreshTeamMembers();
          }, 500);
        }
        return success;
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Error removing team member", {
        description: "An unexpected error occurred."
      });
      return false;
    }
  };
  
  const makeManager = async (id: string | number): Promise<boolean> => {
    try {
      if (onExternalMakeManager) {
        onExternalMakeManager(id);
        return true;
      } else {
        const success = await handleMakeManager(id);
        
        if (projectId && success) {
          setTimeout(() => {
            refreshTeamMembers();
          }, 500);
        }
        return success;
      }
    } catch (error) {
      console.error("Error assigning project manager:", error);
      toast.error("Error assigning project manager", {
        description: "An unexpected error occurred."
      });
      return false;
    }
  };

  return {
    addMember,
    removeMember,
    makeManager
  };
};

export default useTeamOperations;
