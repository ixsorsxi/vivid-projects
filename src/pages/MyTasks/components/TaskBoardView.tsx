
import React, { useState, useCallback } from 'react';
import { Task } from '@/lib/data';
import { cn } from '@/lib/utils';
import TaskQuickEdit from './TaskQuickEdit';
import useTaskDragHandlers from '@/components/projects/components/TaskDragContext';
import TaskColumn from './board/TaskColumn';
import BoardLoadingOverlay from './board/BoardLoadingOverlay';

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
          <TaskColumn
            key={status}
            status={status}
            statusTitle={statusTitles[status as keyof typeof statusTitles]}
            tasks={statusTasks}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            isDragging={isDragging}
            onDragStart={onDragStart}
            onStatusChange={onStatusChange}
            onViewTask={onViewTask}
            onEditTask={handleQuickEdit}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
      
      <BoardLoadingOverlay isLoading={isLoading} />
      
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
