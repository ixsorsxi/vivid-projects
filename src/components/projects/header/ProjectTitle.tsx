
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ProjectTitleProps {
  projectName: string;
  projectStatus: string;
  projectDescription: string;
}

const ProjectTitle: React.FC<ProjectTitleProps> = ({
  projectName,
  projectStatus,
  projectDescription
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
        <Badge variant={projectStatus === 'completed' ? 'success' : 'default'}>
          {projectStatus === 'in-progress' ? 'In Progress' : 
           projectStatus === 'completed' ? 'Completed' : 'Not Started'}
        </Badge>
      </div>
      <p className="text-muted-foreground mt-1">{projectDescription}</p>
    </div>
  );
};

export default ProjectTitle;
