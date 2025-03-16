
import React from 'react';
import { Task } from '@/lib/data';
import { Card } from '@/components/ui/card';
import TaskCard from '@/components/dashboard/TaskCard';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskBoardViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  formatDueDate: (date: string) => string;
}

const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask,
  formatDueDate
}) => {
  // Group tasks by status
  const taskGroups = {
    'to-do': tasks.filter(task => task.status === 'to-do'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'in-review': tasks.filter(task => task.status === 'in-review'),
    'completed': tasks.filter(task => task.status === 'completed')
  };

  const statusTitles = {
    'to-do': 'To Do',
    'in-progress': 'In Progress',
    'in-review': 'In Review',
    'completed': 'Completed'
  };

  // Handle drag and drop functionality
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== targetStatus) {
      // Simulate updating the task status
      const updatedTask = { ...task, status: targetStatus };
      onStatusChange(taskId);
      
      // In a real implementation, you would call an API to update the task status
      console.log(`Moving task ${taskId} to ${targetStatus}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(taskGroups).map(([status, statusTasks]) => (
        <Card 
          key={status} 
          className="p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="font-medium">{statusTitles[status as keyof typeof statusTitles]}</h3>
              <Badge variant="outline" className="ml-2">{statusTasks.length}</Badge>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {statusTasks.map(task => (
              <div 
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="cursor-move"
              >
                <TaskCard
                  task={task}
                  onStatusChange={() => onStatusChange(task.id)}
                  onViewDetails={() => onViewTask(task)}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              </div>
            ))}
            {statusTasks.length === 0 && (
              <div className="border border-dashed rounded-md p-4 text-center">
                <p className="text-muted-foreground text-sm">No tasks</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaskBoardView;
