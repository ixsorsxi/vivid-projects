
import { useState } from 'react';
import { Task } from '@/lib/data';

interface UseCalendarDragDropProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  updateTask?: (taskId: string, updates: Partial<Task>) => void;
}

export const useCalendarDragDrop = ({ 
  tasks, 
  setTasks,
  updateTask 
}: UseCalendarDragDropProps) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    setIsDragging(true);
    
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId,
      timestamp: Date.now()
    }));
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('bg-primary/10');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/10');
    }
  };
  
  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/10');
    }
    
    if (!draggedTaskId) return;
    
    const formattedDate = date.toISOString().split('T')[0];
    
    if (updateTask) {
      updateTask(draggedTaskId, { dueDate: formattedDate });
    } else {
      // Fixed TypeScript error by explicitly typing the returned array as Task[]
      setTasks((prevTasks: Task[]) => {
        return prevTasks.map(task => {
          if (task.id === draggedTaskId) {
            return { ...task, dueDate: formattedDate };
          }
          return task;
        });
      });
    }
    
    setDraggedTaskId(null);
    setIsDragging(false);
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setIsDragging(false);
    setDragOverDate(null);
    
    // Clean up any elements that might still have drag classes
    document.querySelectorAll('.opacity-50, .bg-primary\\/10').forEach(element => {
      if (element instanceof HTMLElement) {
        element.classList.remove('opacity-50', 'bg-primary/10');
      }
    });
  };
  
  return {
    draggedTaskId,
    isDragging,
    dragOverDate,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
};

export default useCalendarDragDrop;
