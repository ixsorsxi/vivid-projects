
import React, { useState } from 'react';
import { Task } from '@/lib/types/task';
import TaskColumn from './board/TaskColumn';
import { Loader2 } from 'lucide-react';

interface TaskBoardViewProps {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  isLoading,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask
}) => {
  // State for drag and drop functionality
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Task status categories
  const statusCategories = ['to-do', 'in-progress', 'in-review', 'done'];
  
  // Filter tasks by status
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => {
      const normalizedStatus = normalizeStatus(task.status);
      return normalizedStatus === status;
    });
  };

  // Normalize task status to match our categories
  const normalizeStatus = (status: string): string => {
    status = status.toLowerCase();
    if (status === 'done' || status === 'completed') return 'done';
    if (status === 'in-review' || status === 'review') return 'in-review';
    if (status === 'in-progress' || status === 'progress') return 'in-progress';
    return 'to-do';
  };

  // Handle task drag start
  const handleDragStart = (e: React.DragEvent, taskId: string, status: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setDraggedTask(task);
      setIsDragging(true);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 h-full min-h-[500px]">
      {statusCategories.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={getTasksByStatus(status)}
          onDragStart={handleDragStart}
          onStatusChange={onStatusChange}
          onViewTask={onViewTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskBoardView;
