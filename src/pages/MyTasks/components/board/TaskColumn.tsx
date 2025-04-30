
import React from 'react';
import { Task } from '@/lib/types/task';
import TaskDragContainer from './TaskDragContainer';

interface TaskColumnProps {
  status: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string, status: string) => void;
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  tasks,
  onDragStart,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask
}) => {
  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'to-do': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'in-review': return 'In Review';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'to-do': return 'border-gray-200';
      case 'in-progress': return 'border-blue-200';
      case 'in-review': return 'border-amber-200';
      case 'done': return 'border-green-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-muted/30 rounded-lg p-3 border-t-4 ${getColumnColor(status)}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">{getColumnTitle(status)}</h3>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 min-h-[100px]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskDragContainer
              key={task.id}
              task={task}
              status={status}
              onDragStart={onDragStart}
              onStatusChange={() => onStatusChange(task.id)}
              onViewTask={() => onViewTask(task)}
              onEditTask={() => onEditTask(task)}
              onDeleteTask={() => onDeleteTask(task.id)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-20 border border-dashed rounded-lg text-muted-foreground text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
