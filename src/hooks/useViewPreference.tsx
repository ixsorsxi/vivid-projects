
import { useState, useEffect } from 'react';
import { ViewType } from '@/types/view';

interface UseViewPreferenceOptions {
  defaultView?: ViewType;
  storageKey?: string;
  onViewChange?: (view: ViewType) => void;
}

export const useViewPreference = ({
  defaultView = 'list',
  storageKey = 'viewPreference',
  onViewChange
}: UseViewPreferenceOptions = {}) => {
  // Initialize state from localStorage or default
  const [viewType, setViewTypeState] = useState<ViewType>(() => {
    const savedView = localStorage.getItem(storageKey);
    return (savedView as ViewType) || defaultView;
  });

  // Initialize loading state for view transitions
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  // Update viewType state and persist to localStorage
  const setViewType = (view: ViewType) => {
    setIsViewTransitioning(true);
    setViewTypeState(view);
    localStorage.setItem(storageKey, view);
    
    // Call onViewChange callback if provided
    if (onViewChange) {
      onViewChange(view);
    }
    
    // Simulate transition completion after a delay
    setTimeout(() => {
      setIsViewTransitioning(false);
    }, 300);
  };

  // Update localStorage when viewType changes
  useEffect(() => {
    localStorage.setItem(storageKey, viewType);
  }, [viewType, storageKey]);

  return { viewType, setViewType, isViewTransitioning };
};

export default useViewPreference;
