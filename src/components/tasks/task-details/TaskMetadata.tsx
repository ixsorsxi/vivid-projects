
import React from 'react';
import { Calendar, Briefcase } from 'lucide-react';

interface TaskMetadataProps {
  dueDate: string;
  project?: string;
  formatDate: (dateString: string) => string;
}

const TaskMetadata: React.FC<TaskMetadataProps> = ({ dueDate, project, formatDate }) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
        <span>Due Date: {formatDate(dueDate)}</span>
      </div>
      
      {project && (
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Project: {project}</span>
        </div>
      )}
    </div>
  );
};

export default TaskMetadata;
