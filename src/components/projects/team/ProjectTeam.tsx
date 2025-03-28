
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { TeamMember } from './types';
import TeamMemberCard from './TeamMemberCard';
import AddMemberDialog from './add-member';

interface ProjectTeamProps {
  team: TeamMember[];
  onAddMember?: (email: string, role: string) => void;
  onRemoveMember?: (id: number) => void;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ 
  team,
  onAddMember,
  onRemoveMember
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(team || []);

  useEffect(() => {
    // Ensure team members have valid properties even when data is incomplete
    const validTeam = (team || []).map(member => ({
      id: member.id,
      name: member.name || member.role || 'Team Member',
      role: member.role || 'Member'
    }));
    setTeamMembers(validTeam);
  }, [team]);

  const handleAddMember = (email: string, role: string) => {
    if (onAddMember) {
      onAddMember(email, role);
    } else {
      const newMember: TeamMember = {
        id: Date.now(),
        name: email.includes('@') ? email.split('@')[0] : email,
        role: role
      };
      
      setTeamMembers([...teamMembers, newMember]);
    }
  };

  const handleRemoveMember = (id: number) => {
    if (onRemoveMember) {
      onRemoveMember(id);
    } else {
      const updatedTeam = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedTeam);
    }
  };

  return (
    <>
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Team Members</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Project team ({teamMembers.length} members)
            </p>
          </div>
          <Button size="sm" onClick={() => setIsAddMemberOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map(member => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              onRemove={handleRemoveMember}
            />
          ))}
          
          {teamMembers.length === 0 && (
            <div className="col-span-2 p-6 text-center border rounded-lg">
              <p className="text-muted-foreground">No team members yet</p>
            </div>
          )}
        </div>
      </div>

      <AddMemberDialog 
        open={isAddMemberOpen} 
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
      />
    </>
  );
};

export default ProjectTeam;
