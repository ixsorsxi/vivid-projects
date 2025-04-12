
import React, { useCallback } from 'react';
import { Task } from '@/lib/types/task';
import { DependencyType } from '@/lib/types/common';
import { useDependencyActions } from './useDependencyActions';
import { useDependencyLoader } from './useDependencyLoader';
import { useDependencyValidation } from './useDependencyValidation';

/**
 * A hook that manages task dependencies - provides functions for adding, removing,
 * and checking dependencies between tasks
 */
export const useTaskDependencies = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Dependency actions - add/remove
  const { 
    handleAddDependency, 
    handleRemoveDependency 
  } = useDependencyActions(tasks, setTasks);
  
  // Dependency loading
  const { loadTaskDependencies } = useDependencyLoader(tasks, setTasks);
  
  // Dependency validation
  const { canCompleteTask } = useDependencyValidation();

  return {
    handleAddDependency,
    handleRemoveDependency,
    canCompleteTask,
    loadTaskDependencies
  };
};

export default useTaskDependencies;
