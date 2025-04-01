
import React from 'react';
import { Briefcase, User } from 'lucide-react';

interface ProjectTypeManagerProps {
  projectType: string;
  managerName?: string;
}

const ProjectTypeManager: React.FC<ProjectTypeManagerProps> = ({ 
  projectType, 
  managerName = 'Not Assigned'
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center space-x-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Project Type</h3>
          <p className="text-sm text-muted-foreground">
            {projectType || 'Development'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Project Manager</h3>
          <p className="text-sm text-muted-foreground">
            {managerName && managerName !== 'Not Assigned' ? managerName : 'Not Assigned'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeManager;
