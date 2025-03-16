
import { useState, useEffect } from 'react';
import { ViewType } from '@/types/view';

interface UseViewPreferenceOptions {
  defaultView?: ViewType;
  storageKey?: string;
}

export const useViewPreference = ({
  defaultView = 'list',
  storageKey = 'viewPreference'
}: UseViewPreferenceOptions = {}) => {
  // Initialize state from localStorage or default
  const [viewType, setViewTypeState] = useState<ViewType>(() => {
    const savedView = localStorage.getItem(storageKey);
    return (savedView as ViewType) || defaultView;
  });

  // Update viewType state and persist to localStorage
  const setViewType = (view: ViewType) => {
    setViewTypeState(view);
    localStorage.setItem(storageKey, view);
  };

  // Update localStorage when viewType changes
  useEffect(() => {
    localStorage.setItem(storageKey, viewType);
  }, [viewType, storageKey]);

  return { viewType, setViewType };
};

export default useViewPreference;
