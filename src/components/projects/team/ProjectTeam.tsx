import React, { useState, useEffect } from 'react';
import { TeamMember } from './types';
import { useTeamMembers } from './hooks/useTeamMembers';
import { toast } from '@/components/ui/toast-wrapper';
import { checkProjectMemberAccess } from '@/api/projects/modules/team/fixRlsPolicy';
import { fetchTeamManagerName } from '@/api/projects/modules/team';
import TeamContainer from './components/TeamContainer';
import TeamContent from './components/TeamContent';
import TeamDialogs from './components/TeamDialogs';

interface ProjectTeamProps {
  team: TeamMember[];
  projectId?: string;
  onAddMember?: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => void;
  onRemoveMember?: (id: string | number) => void;
  onMakeManager?: (id: string | number) => void;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ 
  team,
  projectId,
  onAddMember,
  onRemoveMember,
  onMakeManager
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [localTeam, setLocalTeam] = useState<TeamMember[]>(team || []);
  const [projectManagerName, setProjectManagerName] = useState<string | null>(null);
  const [hasAccessChecked, setHasAccessChecked] = useState(false);
  const [isLocalAddingMember, setIsLocalAddingMember] = useState(false);
  
  useEffect(() => {
    if (team) {
      console.log('ProjectTeam received new team data:', team);
      setLocalTeam(team);
    }
  }, [team]);

  useEffect(() => {
    if (projectId && !hasAccessChecked) {
      const checkAccess = async () => {
        try {
          console.log("Checking project member access for RLS policy issues...");
          const hasAccess = await checkProjectMemberAccess(projectId);
          
          if (!hasAccess) {
            console.warn("Potential RLS policy issue detected with project_members table");
            toast.error("Access issue detected", {
              description: "There might be an issue with database permissions. Please contact support."
            });
          }
          
          setHasAccessChecked(true);
        } catch (error) {
          console.error("Error checking access:", error);
        }
      };
      
      checkAccess();
    }
  }, [projectId, hasAccessChecked]);
  
  useEffect(() => {
    if (projectId) {
      const getProjectManager = async () => {
        try {
          const managerName = await fetchTeamManagerName(projectId);
          console.log("Fetched project manager name:", managerName);
          if (managerName) {
            setProjectManagerName(managerName);
          }
        } catch (error) {
          console.error('Error fetching project manager:', error);
        }
      };
      
      getProjectManager();
    }
  }, [projectId, localTeam]);
  
  const {
    teamMembers,
    isRefreshing,
    isAdding,
    isRemoving,
    isUpdating,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  } = useTeamMembers(localTeam, projectId);

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
        
        setIsAddMemberOpen(false);
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
        
        setIsAddMemberOpen(false);
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
      
      const success = await handleRemoveMember(memberId);
      
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
      
      const success = await assignProjectManager(memberId);
      
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

  return (
    <>
      <TeamContainer>
        <TeamContent
          teamMembers={teamMembers}
          isRefreshing={isRefreshing}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          projectManagerName={projectManagerName}
          refreshTeamMembers={refreshTeamMembers}
          onAddMember={() => setIsAddMemberOpen(true)}
          onRemove={handleRemoveTeamMember}
          onMakeManager={handleMakeManager}
        />
      </TeamContainer>

      <TeamDialogs
        isAddMemberOpen={isAddMemberOpen}
        setIsAddMemberOpen={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={handleAddTeamMember}
        isAddingMember={isLocalAddingMember || isAdding}
      />
    </>
  );
};

export default ProjectTeam;
