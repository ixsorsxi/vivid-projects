
import React from 'react';
import { Badge } from '@/components/ui/badge';
import TaskStatusBadge from './TaskStatusBadge';

interface TaskBadgesProps {
  status: string;
  project?: string;
}

const TaskBadges: React.FC<TaskBadgesProps> = ({ status, project }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <TaskStatusBadge status={status} />
      
      {project && (
        <Badge variant="outline" size="sm" className="bg-background/50">
          {project}
        </Badge>
      )}
    </div>
  );
};

export default TaskBadges;
