
import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/dashboard/TaskCard';
import { Task } from '@/lib/data';

interface TasksForDateCardProps {
  selectedDate: Date;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TasksForDateCard: React.FC<TasksForDateCardProps> = ({
  selectedDate,
  tasks,
  onDragStart,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4 flex items-center">
        Tasks for {format(selectedDate, 'MMMM d, yyyy')}
        {tasks.length > 0 && (
          <Badge className="ml-2">{tasks.length}</Badge>
        )}
      </h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div 
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              className="cursor-move transition-all"
            >
              <TaskCard
                task={task}
                onStatusChange={() => onStatusChange(task.id)}
                onViewDetails={() => onViewTask(task)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No tasks due on this day</p>
            <Button variant="outline" size="sm" className="mt-2">
              <CalendarDays className="h-4 w-4 mr-2" />
              Add task for this day
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TasksForDateCard;
