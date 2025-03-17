
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TaskStatusBadgesProps {
  status: string;
  priority: string;
}

const TaskStatusBadges: React.FC<TaskStatusBadgesProps> = ({ status, priority }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'to-do':
        return <Badge variant="outline">To Do</Badge>;
      case 'in-progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'in-review':
        return <Badge className="bg-purple-500/15 text-purple-500 border-purple-500/20">In Review</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return null;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/20">Low Priority</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/20">Medium Priority</Badge>;
      case 'high':
        return <Badge className="bg-rose-500/15 text-rose-500 border-rose-500/20">High Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      {getStatusBadge(status)}
      {getPriorityBadge(priority)}
    </>
  );
};

export default TaskStatusBadges;
