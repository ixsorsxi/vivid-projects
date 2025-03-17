
import React from 'react';
import { BadgeProps } from '@/components/ui/badge';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/lib/data';
import TaskStatusBadges from './TaskStatusBadges';

interface TaskDetailsHeaderProps {
  task: Task;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({ task }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl">{task.title}</DialogTitle>
      <div className="flex flex-wrap gap-2 mt-2">
        <TaskStatusBadges status={task.status} priority={task.priority} />
      </div>
    </DialogHeader>
  );
};

export default TaskDetailsHeader;
