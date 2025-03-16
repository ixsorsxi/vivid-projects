
import React from 'react';
import { useViewPreference } from '@/hooks/useViewPreference';
import { formatDueDate } from '../../utils/dateUtils';

export const useTaskUI = () => {
  const [isLoadingView, setIsLoadingView] = React.useState(false);
  
  // Use enhanced view preference hook with transition state
  const { viewType, setViewType, isViewTransitioning } = useViewPreference({
    defaultView: 'list',
    storageKey: 'myTasks.viewPreference',
    onViewChange: () => {
      setIsLoadingView(true);
      // Simulate loading state for view transitions
      setTimeout(() => setIsLoadingView(false), 300);
    }
  });

  return {
    viewType,
    setViewType,
    isViewTransitioning,
    isLoadingView,
    formatDueDate
  };
};

export default useTaskUI;
