
import React from 'react';
import { Clock } from 'lucide-react';

interface TaskDueDateProps {
  dueDate?: string;
  formatDate: (dateString?: string) => string;
}

const TaskDueDate: React.FC<TaskDueDateProps> = ({ dueDate, formatDate }) => {
  if (!dueDate) return null;
  
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Clock className="h-3 w-3 mr-1" />
      <span>Due {formatDate(dueDate)}</span>
    </div>
  );
};

export default TaskDueDate;
