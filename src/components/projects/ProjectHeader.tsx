
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, CheckCircle } from 'lucide-react';

interface ProjectHeaderProps {
  projectName: string;
  projectStatus: string;
  projectDescription: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  projectStatus,
  projectDescription
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
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
      
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <Button variant="outline" size="sm">
          <User className="mr-2 h-4 w-4" />
          Add Member
        </Button>
        <Button variant="default" size="sm">
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark Complete
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
