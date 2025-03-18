
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/lib/types/task';
import TaskStatusBadges from './TaskStatusBadges';

interface TaskDetailsHeaderProps {
  task: Task;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({ task }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
      <div className="flex flex-wrap gap-2 mt-2">
        <TaskStatusBadges status={task.status} priority={task.priority} />
      </div>
    </DialogHeader>
  );
};

export default TaskDetailsHeader;
