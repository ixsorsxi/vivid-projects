
import React, { useState, useCallback } from 'react';
import { Task } from '@/lib/data';
import { Card } from '@/components/ui/card';
import TaskCard from '@/components/dashboard/TaskCard';
import { Badge } from '@/components/ui/badge';
import { Plus, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskQuickEdit from './TaskQuickEdit';
import useTaskDragHandlers from '@/components/projects/components/TaskDragContext';
import { cn } from '@/lib/utils';

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
  const [quickEditTask, setQuickEditTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Group tasks by status - memoize this to prevent recalculations
  const taskGroups = React.useMemo(() => ({
    'to-do': tasks.filter(task => task.status === 'to-do'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'in-review': tasks.filter(task => task.status === 'in-review'),
    'completed': tasks.filter(task => task.status === 'completed')
  }), [tasks]);

  const statusTitles = {
    'to-do': 'To Do',
    'in-progress': 'In Progress',
    'in-review': 'In Review',
    'completed': 'Completed'
  };

  // Improved drag and drop handlers with visual feedback
  const {
    onDragStart,
    onDragOver,
    onDrop,
    isDragging,
    onDragLeave,
    onDragEnd
  } = useTaskDragHandlers((taskId, newStatus) => {
    // Set loading state for better user feedback
    setIsLoading(true);
    
    // Call the status change handler
    onStatusChange(taskId);
    
    // Clear loading state after a short delay
    setTimeout(() => setIsLoading(false), 300);
  });

  // Handle opening the quick edit modal
  const handleQuickEdit = useCallback((task: Task) => {
    setQuickEditTask(task);
  }, []);

  // Handle closing the quick edit modal
  const handleCloseQuickEdit = useCallback(() => {
    setQuickEditTask(null);
  }, []);

  // Handle saving quick edits
  const handleSaveQuickEdit = useCallback((updatedTask: Task) => {
    onEditTask(updatedTask);
    setQuickEditTask(null);
  }, [onEditTask]);

  return (
    <>
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        isDragging && "is-dragging-active",
        isLoading && "opacity-80 pointer-events-none transition-opacity"
      )}>
        {Object.entries(taskGroups).map(([status, statusTasks]) => (
          <Card 
            key={status} 
            className={cn("p-4 transition-all", isDragging && "border-dashed")}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, status)}
            onDragEnd={onDragEnd}
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
              {statusTasks.length === 0 ? (
                <div className="border border-dashed rounded-md p-4 text-center">
                  <p className="text-muted-foreground text-sm">No tasks</p>
                </div>
              ) : (
                statusTasks.map(task => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id, status)}
                    className="cursor-move transition-all"
                  >
                    <TaskCard
                      task={task}
                      onStatusChange={() => onStatusChange(task.id)}
                      onViewDetails={() => onViewTask(task)}
                      onEdit={() => handleQuickEdit(task)} // Changed to quick edit
                      onDelete={() => onDeleteTask(task.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Quick Edit Dialog */}
      {quickEditTask && (
        <TaskQuickEdit
          task={quickEditTask}
          onClose={handleCloseQuickEdit}
          onSave={handleSaveQuickEdit}
        />
      )}
    </>
  );
};

export default TaskBoardView;
