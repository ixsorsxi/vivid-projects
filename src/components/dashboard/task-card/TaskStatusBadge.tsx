
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TaskStatusBadgeProps {
  status: string;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'to-do':
      return <Badge variant="outline" size="sm">To Do</Badge>;
    case 'in-progress':
      return <Badge variant="primary" size="sm">In Progress</Badge>;
    case 'in-review':
      return <Badge className="bg-purple-500/15 text-purple-500 border-purple-500/20" size="sm">In Review</Badge>;
    case 'completed':
      return <Badge variant="success" size="sm">Completed</Badge>;
    default:
      return null;
  }
};

export default TaskStatusBadge;
