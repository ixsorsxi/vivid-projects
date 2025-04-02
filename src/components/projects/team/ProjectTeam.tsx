import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { TeamMember } from './types';
import TeamMemberCard from './TeamMemberCard';
import AddMemberDialog from './add-member';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { addProjectTeamMember, removeProjectTeamMember } from '@/api/projects/modules/team';

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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(team || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const validTeam = (team || []).map(member => ({
      id: member.id || String(Date.now()),
      name: member.name || 'Team Member',
      role: member.role || 'Member',
      user_id: member.user_id
    }));
    
    console.log('Processing team members in ProjectTeam component:', validTeam);
    setTeamMembers(validTeam);
  }, [team]);

  const refreshTeamMembers = async () => {
    if (!projectId) return;
    
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select('id, user_id, name, role')
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Error refreshing team members:', error);
        return;
      }
      
      if (data) {
        const freshTeamMembers = data.map(member => ({
          id: member.id,
          name: member.name || 'Team Member',
          role: member.role || 'Member',
          user_id: member.user_id
        }));
        
        console.log('Refreshed team members:', freshTeamMembers);
        setTeamMembers(freshTeamMembers);
      }
    } catch (err) {
      console.error('Error in refreshTeamMembers:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddMember = async (member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    if (projectId) {
      const success = await addProjectTeamMember(projectId, member);
      
      if (success) {
        toast.success("Team member added", {
          description: `${member.name} has been added to the project team`,
        });
        
        await refreshTeamMembers();
      } else {
        toast.error("Failed to add team member", {
          description: "There was an error adding the team member to the project",
        });
      }
    } else if (onAddMember) {
      onAddMember(member);
    } else {
      const newMember: TeamMember = {
        id: member.id || String(Date.now()),
        name: member.name,
        role: member.role,
        user_id: member.user_id
      };
      
      setTeamMembers([...teamMembers, newMember]);
      toast("Team member added", {
        description: `${member.name} has been added to the project team`,
      });
    }
  };

  const handleRemoveMember = async (id: string | number) => {
    const stringId = id.toString();
    
    if (projectId) {
      const success = await removeProjectTeamMember(projectId, stringId);
      
      if (success) {
        toast.success("Team member removed", {
          description: "The team member has been removed from the project",
        });
        
        await refreshTeamMembers();
      } else {
        toast.error("Failed to remove team member", {
          description: "There was an error removing the team member from the project",
        });
      }
    } else if (onRemoveMember) {
      onRemoveMember(id);
    } else {
      const updatedTeam = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedTeam);
      toast("Team member removed", {
        description: "The team member has been removed from the project",
      });
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
          <Button 
            size="sm" 
            onClick={() => setIsAddMemberOpen(true)}
            disabled={isRefreshing}
          >
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
        projectId={projectId}
        onAddMember={handleAddMember}
      />
    </>
  );
};

export default ProjectTeam;
