
import React, { useState } from 'react';
import { Task } from '@/lib/data';
import TaskColumn from './board/TaskColumn';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/toast-wrapper';

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
  { id: 'to-do', title: 'To Do', color: 'from-blue-500/20 to-blue-500/5' },
  { id: 'in-progress', title: 'In Progress', color: 'from-amber-500/20 to-amber-500/5' },
  { id: 'in-review', title: 'In Review', color: 'from-purple-500/20 to-purple-500/5' },
  { id: 'completed', title: 'Completed', color: 'from-green-500/20 to-green-500/5' }
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
      
      // Show a toast or animation when task is moved
      toast({
        title: "Task updated",
        description: `Moved to ${STATUS_COLUMNS.find(col => col.id === status)?.title}`,
      });
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-300px)]"
    >
      {STATUS_COLUMNS.map((column, index) => (
        <motion.div
          key={column.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <TaskColumn
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
            gradientColor={column.color}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TaskBoardView;
