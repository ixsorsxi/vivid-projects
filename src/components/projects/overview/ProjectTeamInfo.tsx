
import React from 'react';
import { Users } from 'lucide-react';

interface ProjectTeamInfoProps {
  membersCount: number;
}

const ProjectTeamInfo: React.FC<ProjectTeamInfoProps> = ({ membersCount }) => {
  return (
    <div className="flex items-center space-x-2">
      <Users className="h-5 w-5 text-primary" />
      <div>
        <h3 className="font-medium">Team Members</h3>
        <p className="text-sm text-muted-foreground">
          {membersCount} {membersCount === 1 ? 'member' : 'members'} working on this project
        </p>
      </div>
    </div>
  );
};

export default ProjectTeamInfo;
