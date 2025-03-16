
import { useState, useEffect } from 'react';

type ViewType = 'list' | 'board' | 'calendar' | 'kanban' | 'gantt';

export const useViewPreference = (
  defaultView: ViewType = 'list',
  storageKey: string = 'viewPreference'
) => {
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
