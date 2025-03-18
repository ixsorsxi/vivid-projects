
import React from 'react';
import { ProjectStatus } from '@/lib/types/common';
import ProjectTitle from './ProjectTitle';
import ProjectStatusActions from './ProjectStatusActions';
import { Button } from '@/components/ui/button';
import { Users, Bell, Share } from 'lucide-react';

export interface ProjectHeaderProps {
  projectName: string;
  projectStatus: ProjectStatus;
  projectDescription: string;
  onStatusChange?: (newStatus: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  projectStatus,
  projectDescription,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <ProjectTitle 
        projectName={projectName} 
        projectStatus={projectStatus}
        projectDescription={projectDescription}
      />
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        <ProjectStatusActions 
          projectStatus={projectStatus} 
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
};

export default ProjectHeader;
