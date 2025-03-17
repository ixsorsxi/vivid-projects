
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
  // Create a wrapper for onDragStart that handles the event type correctly
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    onDragStart(e, task.id, status);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="cursor-move"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        <TaskCard
          task={task}
          onStatusChange={() => onStatusChange(task.id)}
          onViewDetails={() => onViewTask(task)}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
        />
      </motion.div>
    </div>
  );
};

export default TaskDragContainer;
