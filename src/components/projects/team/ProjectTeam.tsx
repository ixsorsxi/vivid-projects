
import React, { useState } from 'react';
import { TeamMember } from './types';
import AddMemberDialog from './add-member';
import { useTeamMembers } from './hooks/useTeamMembers';
import TeamHeader from './components/TeamHeader';
import TeamGrid from './components/TeamGrid';

interface ProjectTeamProps {
  team: TeamMember[];
  projectId?: string;
  onAddMember?: (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => void;
  onRemoveMember?: (id: string | number) => void;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ 
  team,
  projectId,
  onAddMember,
  onRemoveMember
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  
  const {
    teamMembers,
    isRefreshing,
    isRemoving,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember
  } = useTeamMembers(team, projectId);

  const addMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    if (onAddMember) {
      onAddMember(member);
    } else {
      await handleAddMember(member);
    }
  };

  const removeMember = async (id: string | number) => {
    if (onRemoveMember) {
      onRemoveMember(id);
    } else {
      await handleRemoveMember(id);
    }
  };

  return (
    <>
      <div className="glass-card p-6 rounded-xl">
        <TeamHeader 
          memberCount={teamMembers.length}
          isRefreshing={isRefreshing}
          onRefresh={refreshTeamMembers}
          onAddMember={() => setIsAddMemberOpen(true)}
        />
        
        <TeamGrid
          members={teamMembers}
          onRemove={removeMember}
          isRemoving={isRemoving}
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
