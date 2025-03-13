
import React from 'react';
import { cn } from '@/lib/utils';
import TaskPriorityIndicator from './TaskPriorityIndicator';

interface TaskCardTitleProps {
  title: string;
  priority: string;
  isChecked: boolean;
}

const TaskCardTitle: React.FC<TaskCardTitleProps> = ({ title, priority, isChecked }) => {
  return (
    <div className="flex items-center gap-2">
      <TaskPriorityIndicator priority={priority} />
      <h3 className={cn(
        "font-medium text-base line-clamp-1",
        isChecked && "line-through text-muted-foreground"
      )}>
        {title}
      </h3>
    </div>
  );
};

export default TaskCardTitle;
