
import React from 'react';
import { Task } from '@/lib/data';
import TaskCard from '@/components/dashboard/TaskCard';
import { motion } from 'framer-motion';

interface TaskDragContainerProps {
  task: Task;
  status: string;
  onDragStart: (e: React.DragEvent, taskId: string, status: string) => void;
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskDragContainer: React.FC<TaskDragContainerProps> = ({
  task,
  status,
  onDragStart,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id, status)}
      className="cursor-move transition-all hover:scale-[1.01] active:scale-[0.99]"
    >
      <TaskCard
        task={task}
        onStatusChange={() => onStatusChange(task.id)}
        onViewDetails={() => onViewTask(task)}
        onEdit={() => onEditTask(task)}
        onDelete={() => onDeleteTask(task.id)}
      />
    </div>
  );
};

export default TaskDragContainer;
