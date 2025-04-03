
import React, { useState, useEffect } from 'react';
import { TeamMember } from './types';
import { useTeamMembers } from './hooks/useTeamMembers';
import { toast } from '@/components/ui/toast-wrapper';
import { checkProjectMemberAccess } from '@/api/projects/modules/team/fixRlsPolicy';
import { fetchProjectManagerName } from '@/api/projects/modules/team/projectManager';
import { useTeamOperations } from './components/TeamOperations';
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
  
  // Update local team when prop changes
  useEffect(() => {
    if (team) {
      console.log('ProjectTeam received new team data:', team);
      setLocalTeam(team);
    }
  }, [team]);

  // Check RLS policy access
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
  
  // Fetch project manager name
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
  
  // Setup team data and operations
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

  // Set up team operations
  const operations = useTeamOperations({
    projectId,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    handleMakeManager: assignProjectManager,
    onExternalAddMember: onAddMember,
    onExternalRemoveMember: onRemoveMember,
    onExternalMakeManager: onMakeManager
  });

  // Handler for adding a team member through dialog
  const handleAddTeamMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    const success = await operations.addMember(member);
    if (success) {
      setIsAddMemberOpen(false);
    }
    return success;
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
          onRemove={operations.removeMember}
          onMakeManager={operations.makeManager}
        />
      </TeamContainer>

      <TeamDialogs
        isAddMemberOpen={isAddMemberOpen}
        setIsAddMemberOpen={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={handleAddTeamMember}
      />
    </>
  );
};

export default ProjectTeam;
