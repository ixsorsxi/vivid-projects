
import { format, isSameDay, parseISO } from 'date-fns';

// Format a date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy');
};

// Format time for display
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'h:mm a');
};

// Format date and time for display
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy h:mm a');
};

// Check if a date is today
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isSameDay(dateObj, new Date());
};

// Format due date (used in tasks)
export const formatDueDate = (date: string) => {
  const taskDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (taskDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (taskDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(taskDate);
  }
};
