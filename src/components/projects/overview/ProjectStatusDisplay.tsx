
import React from 'react';
import { Clock } from 'lucide-react';
import { ProjectStatus } from '@/lib/types/common';

interface ProjectStatusDisplayProps {
  status: ProjectStatus;
}

const ProjectStatusDisplay: React.FC<ProjectStatusDisplayProps> = ({ status }) => {
  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-primary" />
      <div>
        <h3 className="font-medium">Project Status</h3>
        <div className="text-sm">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
            status === 'on-hold' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            {status === 'in-progress' ? 'In Progress' : 
             status === 'not-started' ? 'Not Started' : 
             status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatusDisplay;
