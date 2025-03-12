
import React from 'react';
import { Badge } from "@/components/ui/badge";
import TaskCard from '@/components/dashboard/TaskCard';
import { Task } from '@/lib/data';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TaskColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, currentStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  status,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  onDeleteTask
}) => {
  return (
    <div 
      className="border rounded-lg p-4"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id, status)}
            className="cursor-move"
          >
            <TaskCard 
              task={{
                ...task,
                status: task.status as 'to-do' | 'in-progress' | 'in-review' | 'completed',
                priority: task.priority as 'low' | 'medium' | 'high',
                assignees: task.assignees || []
              }}
              actions={
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              }
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
