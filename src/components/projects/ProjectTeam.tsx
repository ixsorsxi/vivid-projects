
import React from 'react';
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

interface ProjectTeamProps {
  team: TeamMember[];
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ team }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <Button size="sm">Invite Member</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map(member => (
          <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTeam;
