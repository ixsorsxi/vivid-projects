
import { useState, useCallback } from 'react';
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import useViewPreference from '@/hooks/useViewPreference';

export const useTaskUI = () => {
  const [isLoadingView, setIsLoadingView] = useState(false);
  
  // View transition handling
  const { viewType, setViewType, isViewTransitioning } = useViewPreference({
    defaultView: 'list',
    storageKey: 'myTasks.viewPreference',
    onViewChange: () => {
      setIsLoadingView(true);
      // Simulate loading state for smooth transitions
      setTimeout(() => setIsLoadingView(false), 300);
    }
  });
  
  // Format date for display in task items
  const formatDueDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  }, []);
  
  return {
    viewType,
    setViewType,
    isViewTransitioning,
    isLoadingView,
    setIsLoadingView,
    formatDueDate
  };
};

export default useTaskUI;
