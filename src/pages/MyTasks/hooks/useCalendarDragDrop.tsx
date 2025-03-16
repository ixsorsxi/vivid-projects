
import { useCallback } from 'react';
import { Task } from '@/lib/data';
import { isSameDay } from 'date-fns';

interface UseCalendarDragDropProps {
  tasks: Task[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setTasksForSelectedDate: (tasks: Task[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  onEditTask: (task: Task) => void;
}

export const useCalendarDragDrop = ({
  tasks,
  selectedDate,
  setSelectedDate,
  setTasksForSelectedDate,
  setIsLoading,
  onEditTask
}: UseCalendarDragDropProps) => {
  // Drag handling for calendar items
  const onDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
  }, []);
  
  // Allow dropping tasks on dates
  const onDateDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('bg-primary/20');
    }
  }, []);
  
  const onDateDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/20');
    }
  }, []);
  
  // Handle dropping a task on a date to change its due date
  const onDateDrop = useCallback((e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/20');
    }
    
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      const updatedTask = { 
        ...task, 
        dueDate: date.toISOString() 
      };
      
      setIsLoading(true);
      onEditTask(updatedTask);
      
      // If dropping on selected date, update the task list
      if (isSameDay(date, selectedDate)) {
        setTasksForSelectedDate(prev => [...prev, updatedTask]);
      } else {
        // If dropping on a different date, update selected date
        setSelectedDate(date);
      }
      
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [tasks, selectedDate, setSelectedDate, setTasksForSelectedDate, setIsLoading, onEditTask]);

  return {
    onDragStart,
    onDateDragOver,
    onDateDragLeave,
    onDateDrop
  };
};

export default useCalendarDragDrop;
