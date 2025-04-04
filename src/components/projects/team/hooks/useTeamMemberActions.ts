
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { debugLog, debugError } from '@/utils/debugLogger';

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
  const [lastError, setLastError] = useState<Error | null>(null);

  const handleAddTeamMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    try {
      debugLog("TeamMemberActions", "Starting team member addition process...");
      setIsLocalAddingMember(true);
      setLastError(null);
      
      // Validate required fields
      if (!member.name || !member.role) {
        const errorMsg = "Name and role are required fields";
        debugError("TeamMemberActions", errorMsg);
        toast.error("Validation Error", {
          description: errorMsg
        });
        return false;
      }
      
      // Validate projectId if using internal handler
      if (!onAddMember && !projectId) {
        const errorMsg = "Project ID is required for adding team members";
        debugError("TeamMemberActions", errorMsg);
        toast.error("Configuration Error", {
          description: errorMsg
        });
        return false;
      }
      
      if (onAddMember) {
        debugLog("TeamMemberActions", "Using external handler to add team member", member);
        onAddMember(member);
        
        toast.success("Team member added", {
          description: `${member.name} has been added to the team`
        });
        
        return true;
      }
      
      debugLog("TeamMemberActions", "Using internal handler to add team member", {
        ...member,
        projectId
      });
      
      const success = await handleAddMember(member);
      
      if (success) {
        debugLog("TeamMemberActions", "Team member added successfully");
        toast.success("Team member added", {
          description: `${member.name} has been added to the team`
        });
        
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
        
        return true;
      } else {
        debugLog("TeamMemberActions", "Failed to add team member");
        toast.error("Failed to add team member", {
          description: "There was an error adding the team member. Please try again."
        });
        return false;
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
      setLastError(errorObj);
      debugError("TeamMemberActions", "Error in handleAddTeamMember:", error);
      
      // Better error message handling
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "This user is already a member of this project.";
        } else if (error.message.includes('violates row-level security policy')) {
          errorMessage = "You don't have permission to add members to this project.";
        } else if (error.message.includes('foreign key constraint')) {
          errorMessage = "Invalid project or user ID.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error("Error adding team member", {
        description: errorMessage
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
      debugError("TeamMemberActions", "Error in handleRemoveTeamMember:", error);
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
      debugError("TeamMemberActions", "Error in handleMakeManager:", error);
      toast.error("Error assigning project manager", {
        description: "An unexpected error occurred"
      });
      return false;
    }
  };

  return {
    isLocalAddingMember,
    lastError,
    handleAddTeamMember,
    handleRemoveTeamMember,
    handleMakeManager
  };
};
