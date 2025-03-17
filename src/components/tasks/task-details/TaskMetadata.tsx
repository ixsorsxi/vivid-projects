
import React from 'react';
import { Calendar, Briefcase, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskMetadataProps {
  dueDate: string;
  project?: string;
  createdAt?: string;
  formatDate: (dateString: string) => string;
}

const TaskMetadata: React.FC<TaskMetadataProps> = ({ 
  dueDate, 
  project, 
  createdAt,
  formatDate 
}) => {
  return (
    <div className="flex flex-col gap-2 text-sm mt-4 bg-background/50 p-3 rounded-md border">
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-muted-foreground mr-1">Due Date:</span>
        <span className="font-medium">{formatDate(dueDate)}</span>
      </div>
      
      {project && (
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">Project:</span>
          <span className="font-medium">{project}</span>
        </div>
      )}
      
      {createdAt && (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">Created:</span>
          <span className="font-medium">{formatDate(createdAt)}</span>
        </div>
      )}
    </div>
  );
};

export default TaskMetadata;
