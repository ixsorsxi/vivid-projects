
import React from 'react';
import { Task } from '@/lib/data';
import TaskColumn from './TaskColumn';

interface TasksKanbanViewProps {
  tasksByStatus: {
    'not-started': Task[];
    'in-progress': Task[];
    'completed': Task[];
  };
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, currentStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TasksKanbanView: React.FC<TasksKanbanViewProps> = ({
  tasksByStatus,
  onDragOver,
  onDrop,
  onDragStart,
  onDeleteTask
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
        <TaskColumn
          key={status}
          title={status === 'not-started' ? 'Not Started' :
                 status === 'in-progress' ? 'In Progress' : 'Completed'}
          status={status}
          tasks={statusTasks}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TasksKanbanView;
