
import React from 'react';
import ProjectTeamManager from './ProjectTeamManager';

interface ProjectTeamProps {
  projectId: string;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ projectId }) => {
  return <ProjectTeamManager projectId={projectId} />;
};

export default ProjectTeam;
