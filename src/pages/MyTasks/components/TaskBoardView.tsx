
import React, { useState } from 'react';
import { Task } from '@/lib/data';
import TaskColumn from './board/TaskColumn';

interface TaskBoardViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask?: () => void;
  formatDueDate: (date: string) => string;
}

const STATUS_COLUMNS = [
  { id: 'to-do', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'in-review', title: 'In Review' },
  { id: 'completed', title: 'Completed' }
];

const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  formatDueDate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingStatus, setDraggingStatus] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  // Organize tasks by status
  const tasksByStatus = STATUS_COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<string, Task[]>);
  
  const handleDragStart = (e: React.DragEvent, taskId: string, status: string) => {
    setIsDragging(true);
    setDraggedTaskId(taskId);
    setDraggingStatus(status);
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDragEnter = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverColumn(status);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    setDragOverColumn(null);
  };
  
  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    
    if (!draggedTaskId) return;
    
    // Find task in tasks
    const taskToUpdate = tasks.find(task => task.id === draggedTaskId);
    
    if (taskToUpdate && taskToUpdate.status !== status) {
      // Update task with new status
      const updatedTask = {
        ...taskToUpdate,
        status,
        completed: status === 'completed'
      };
      
      onEditTask(updatedTask);
    }
    
    setIsDragging(false);
    setDraggedTaskId(null);
    setDraggingStatus(null);
    setDragOverColumn(null);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTaskId(null);
    setDraggingStatus(null);
    setDragOverColumn(null);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)]">
      {STATUS_COLUMNS.map((column) => (
        <TaskColumn
          key={column.id}
          status={column.id}
          statusTitle={column.title}
          tasks={tasksByStatus[column.id] || []}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          isDragging={isDragging}
          isOver={dragOverColumn === column.id}
          onDragStart={handleDragStart}
          onStatusChange={onStatusChange}
          onViewTask={onViewTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
};

export default TaskBoardView;
