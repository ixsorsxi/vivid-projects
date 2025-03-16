
import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/lib/data';
import { 
  isSameDay, 
  parse, 
  parseISO, 
  startOfMonth,
  addMonths, 
  subMonths, 
  isToday
} from 'date-fns';

export const useCalendarView = (tasks: Task[]) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);

  // Function to safely parse dates from different formats
  const parseTaskDate = useCallback((dateStr: string | Date): Date => {
    if (!dateStr) return new Date();
    
    if (typeof dateStr === 'string') {
      // Try parsing as ISO format first
      try {
        return parseISO(dateStr);
      } catch {
        // Fall back to yyyy-MM-dd format
        try {
          return parse(dateStr, 'yyyy-MM-dd', new Date());
        } catch {
          return new Date();
        }
      }
    }
    
    return new Date(dateStr);
  }, []);

  // Get tasks for selected date
  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      const taskDate = parseTaskDate(task.dueDate);
      return isSameDay(taskDate, selectedDate);
    });
    
    setTasksForSelectedDate(filteredTasks);
  }, [tasks, selectedDate, parseTaskDate]);

  // Function to highlight dates with tasks
  const isDayWithTask = useCallback((day: Date) => {
    return tasks.some(task => {
      const taskDate = parseTaskDate(task.dueDate);
      return isSameDay(taskDate, day);
    });
  }, [tasks, parseTaskDate]);

  // Handlers for navigation
  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setMonth(startOfMonth(today));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setMonth(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonth(prev => addMonths(prev, 1));
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    month,
    setMonth,
    isLoading,
    setIsLoading,
    tasksForSelectedDate,
    setTasksForSelectedDate,
    parseTaskDate,
    isDayWithTask,
    goToToday,
    goToPrevMonth,
    goToNextMonth
  };
};

export default useCalendarView;
