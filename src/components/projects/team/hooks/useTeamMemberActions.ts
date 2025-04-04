
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

interface UseTeamMemberActionsProps {
  projectId?: string;
  onAddMember?: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => void;
  onRemoveMember?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
  handleAddMember: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => Promise<boolean>;
  handleRemoveMember: (id: string) => Promise<boolean>;
  assignProjectManager: (id: string) => Promise<boolean>;
  refreshTeamMembers: () => Promise<void>;
}

export const useTeamMemberActions = ({
  projectId,
  onAddMember,
  onRemoveMember,
  onMakeManager,
  handleAddMember,
  handleRemoveMember,
  assignProjectManager,
  refreshTeamMembers
}: UseTeamMemberActionsProps) => {
  const [isLocalAddingMember, setIsLocalAddingMember] = useState(false);

  const handleAddTeamMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    try {
      console.log("Starting team member addition process...");
      setIsLocalAddingMember(true);
      
      if (onAddMember) {
        console.log("Using external handler to add team member");
        onAddMember(member);
        
        toast.success("Team member added", {
          description: `${member.name} has been added to the team`
        });
        
        setIsLocalAddingMember(false);
        return true;
      }
      
      console.log("Using internal handler to add team member", member);
      const success = await handleAddMember(member);
      
      if (success) {
        console.log("Team member added successfully");
        toast.success("Team member added", {
          description: `${member.name} has been added to the team`
        });
        
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
        
        return true;
      } else {
        console.log("Failed to add team member");
        toast.error("Failed to add team member", {
          description: "There was an error adding the team member. Please try again."
        });
        return false;
      }
    } catch (error) {
      console.error("Error in handleAddTeamMember:", error);
      toast.error("Error adding team member", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
    } finally {
      setIsLocalAddingMember(false);
    }
  };

  const handleRemoveTeamMember = async (memberId: string | number) => {
    try {
      if (onRemoveMember) {
        onRemoveMember(memberId);
        toast.success("Team member removed", {
          description: "The team member has been removed from the project"
        });
        return true;
      }
      
      // Convert memberId to string to match the function parameter type
      const memberIdString = String(memberId);
      const success = await handleRemoveMember(memberIdString);
      
      if (success) {
        toast.success("Team member removed", {
          description: "The team member has been removed from the project"
        });
      } else {
        toast.error("Failed to remove team member", {
          description: "There was an error removing the team member"
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error in handleRemoveTeamMember:", error);
      toast.error("Error removing team member", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  const handleMakeManager = async (memberId: string | number) => {
    try {
      if (onMakeManager) {
        onMakeManager(memberId);
        toast.success("Project manager assigned", {
          description: "The team member has been assigned as project manager"
        });
        return true;
      }
      
      // Convert memberId to string to match the function parameter type
      const memberIdString = String(memberId);
      const success = await assignProjectManager(memberIdString);
      
      if (success) {
        toast.success("Project manager assigned", {
          description: "The team member has been assigned as project manager"
        });
      } else {
        toast.error("Failed to assign project manager", {
          description: "There was an error assigning the project manager"
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error in handleMakeManager:", error);
      toast.error("Error assigning project manager", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };

  return {
    isLocalAddingMember,
    handleAddTeamMember,
    handleRemoveTeamMember,
    handleMakeManager
  };
};
