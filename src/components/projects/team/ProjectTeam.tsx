import React, { useState, useEffect } from 'react';
import { TeamMember } from './types';
import AddMemberDialog from './add-member';
import { useTeamMembers } from './hooks/useTeamMembers';
import TeamHeader from './components/TeamHeader';
import TeamGrid from './components/TeamGrid';
import { fetchProjectManagerName } from '@/api/projects/modules/team/projectManager';
import { toast } from '@/components/ui/toast-wrapper';
import { checkProjectMemberAccess } from '@/api/projects/modules/team/fixRlsPolicy';

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
          const managerName = await fetchProjectManagerName(projectId);
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
    isRemoving,
    isUpdating,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  } = useTeamMembers(localTeam, projectId);

  const addMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    console.log('Adding member in ProjectTeam:', member);
    
    try {
      if (onAddMember) {
        onAddMember(member);
      } else {
        const success = await handleAddMember(member);
        
        if (success) {
          toast.success("Team member added", {
            description: `${member.name} has been added to the project team.`
          });
          
          if (projectId) {
            console.log("Forcing refresh after adding team member");
            await refreshTeamMembers();
          }
        } else {
          toast.error("Failed to add team member", {
            description: "There was an issue adding the team member. Please try again."
          });
        }
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Error adding team member", {
        description: "An unexpected error occurred."
      });
    } finally {
      setIsAddMemberOpen(false);
    }
  };

  const removeMember = async (id: string | number) => {
    try {
      if (onRemoveMember) {
        onRemoveMember(id);
      } else {
        await handleRemoveMember(id);
      }
      
      if (projectId) {
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Error removing team member", {
        description: "An unexpected error occurred."
      });
    }
  };
  
  const makeManager = async (id: string | number) => {
    try {
      if (onMakeManager) {
        onMakeManager(id);
      } else {
        await assignProjectManager(id);
      }
      
      if (projectId) {
        setTimeout(() => {
          refreshTeamMembers();
        }, 500);
      }
    } catch (error) {
      console.error("Error assigning project manager:", error);
      toast.error("Error assigning project manager", {
        description: "An unexpected error occurred."
      });
    }
  };

  console.log('ProjectTeam rendering with teamMembers:', teamMembers);

  return (
    <>
      <div className="glass-card p-6 rounded-xl">
        <TeamHeader 
          memberCount={teamMembers.length}
          isRefreshing={isRefreshing}
          onRefresh={refreshTeamMembers}
          onAddMember={() => setIsAddMemberOpen(true)}
          projectManagerName={projectManagerName}
        />
        
        <TeamGrid
          members={teamMembers}
          onRemove={removeMember}
          onMakeManager={makeManager}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
        />
      </div>

      <AddMemberDialog 
        open={isAddMemberOpen} 
        onOpenChange={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={addMember}
      />
    </>
  );
};

export default ProjectTeam;
