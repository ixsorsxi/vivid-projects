
import React from 'react';

interface TaskPriorityIndicatorProps {
  priority: string;
}

const TaskPriorityIndicator: React.FC<TaskPriorityIndicatorProps> = ({ priority }) => {
  switch (priority) {
    case 'low':
      return <span className="h-2 w-2 rounded-full bg-blue-500" />;
    case 'medium':
      return <span className="h-2 w-2 rounded-full bg-amber-500" />;
    case 'high':
      return <span className="h-2 w-2 rounded-full bg-rose-500" />;
    default:
      return null;
  }
};

export default TaskPriorityIndicator;
