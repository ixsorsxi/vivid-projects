
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/data';
import { cn } from '@/lib/utils';
import TaskDragContainer from './TaskDragContainer';

interface TaskColumnProps {
  status: string;
  statusTitle: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, taskId: string, status: string) => void;
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  statusTitle,
  tasks,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging,
  onDragStart,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <Card 
      className={cn("p-4 transition-all", isDragging && "border-dashed")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="font-medium">{statusTitle}</h3>
          <Badge variant="outline" className="ml-2">{tasks.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="border border-dashed rounded-md p-4 text-center">
            <p className="text-muted-foreground text-sm">No tasks</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskDragContainer
              key={task.id}
              task={task}
              status={status}
              onDragStart={onDragStart}
              onStatusChange={onStatusChange}
              onViewTask={onViewTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default TaskColumn;
