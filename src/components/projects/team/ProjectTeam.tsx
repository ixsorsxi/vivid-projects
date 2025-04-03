
import React, { useState, useEffect } from 'react';
import { TeamMember } from './types';
import AddMemberDialog from './add-member';
import { useTeamMembers } from './hooks/useTeamMembers';
import TeamHeader from './components/TeamHeader';
import TeamGrid from './components/TeamGrid';
import { fetchProjectManagerName } from '@/api/projects/modules/team/projectManager';

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
  
  // Update local team when prop changes
  useEffect(() => {
    if (team) {
      console.log('ProjectTeam received new team data:', team);
      setLocalTeam(team);
    }
  }, [team]);
  
  // Fetch project manager name
  useEffect(() => {
    if (projectId) {
      const getProjectManager = async () => {
        try {
          const managerName = await fetchProjectManagerName(projectId);
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
    if (onAddMember) {
      onAddMember(member);
    } else {
      await handleAddMember(member);
    }
    
    // Force a refresh after adding
    if (projectId) {
      setTimeout(() => {
        refreshTeamMembers();
      }, 1000);
    }
  };

  const removeMember = async (id: string | number) => {
    if (onRemoveMember) {
      onRemoveMember(id);
    } else {
      await handleRemoveMember(id);
    }
    
    // Force a refresh after removing
    if (projectId) {
      setTimeout(() => {
        refreshTeamMembers();
      }, 1000);
    }
  };
  
  const makeManager = async (id: string | number) => {
    if (onMakeManager) {
      onMakeManager(id);
    } else {
      await assignProjectManager(id);
    }
    
    // Force a refresh after updating
    if (projectId) {
      setTimeout(() => {
        refreshTeamMembers();
      }, 1000);
    }
  };

  // Log the actual team members being rendered
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
