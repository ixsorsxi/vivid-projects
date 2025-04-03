
import React, { useState, useEffect } from 'react';
import { TeamMember } from './types';
import AddMemberDialog from './add-member';
import { useTeamMembers } from './hooks/useTeamMembers';
import TeamHeader from './components/TeamHeader';
import TeamGrid from './components/TeamGrid';
import { fetchProjectManagerName } from '@/api/projects/modules/team/projectManager';
import { toast } from '@/components/ui/toast-wrapper';
import { checkProjectMemberAccess } from '@/api/projects/modules/team/fixRlsPolicy';
import { useTeamOperations } from './components/TeamOperations';

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
  
  // Fetch project manager
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
  
  // Setup team hooks
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

  // Handler for adding a team member
  const handleAddTeamMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    const success = await operations.addMember(member);
    if (success) {
      setIsAddMemberOpen(false);
    }
    return success;
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
          onRemove={operations.removeMember}
          onMakeManager={operations.makeManager}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
        />
      </div>

      <AddMemberDialog 
        open={isAddMemberOpen} 
        onOpenChange={setIsAddMemberOpen}
        projectId={projectId}
        onAddMember={handleAddTeamMember}
      />
    </>
  );
};

export default ProjectTeam;
