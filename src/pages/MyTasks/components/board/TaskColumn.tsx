
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
  isOver: boolean;
  onDragStart: (e: React.DragEvent, taskId: string, status: string) => void;
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask?: () => void;
  gradientColor?: string;
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
  isOver,
  onDragStart,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  gradientColor = 'from-gray-200/20 to-gray-100/10'
}) => {
  return (
    <Card 
      className={cn(
        "flex flex-col h-full transition-all duration-200 overflow-hidden bg-gradient-to-b",
        gradientColor,
        isDragging && "border-dashed",
        isOver && "ring-2 ring-primary/30 border-primary/30 border-dashed"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center">
          <h3 className="font-medium">{statusTitle}</h3>
          <Badge variant="outline" className="ml-2 bg-background/50">{tasks.length}</Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-background/50" 
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto p-3 space-y-3 bg-transparent">
        {tasks.length === 0 ? (
          <div className="border border-dashed rounded-md p-6 text-center h-24 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Drop tasks here</p>
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
