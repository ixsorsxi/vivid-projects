
import React from 'react';
import { Task } from '@/lib/data';
import useTaskDependencies from './task-features/useTaskDependencies';
import useTaskSubtasks from './task-features/useTaskSubtasks';
import useTaskAssignees from './task-features/useTaskAssignees';
import useTaskStatus from './task-features/useTaskStatus';

export const useAdvancedTaskFeatures = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Use our smaller, focused hooks
  const { 
    handleAddDependency, 
    handleRemoveDependency, 
    canCompleteTask 
  } = useTaskDependencies(tasks, setTasks);
  
  const { 
    handleAddSubtask, 
    handleToggleSubtask, 
    handleDeleteSubtask 
  } = useTaskSubtasks(tasks, setTasks);
  
  const { 
    handleAddAssignee, 
    handleRemoveAssignee, 
    availableUsers 
  } = useTaskAssignees(tasks, setTasks);
  
  const { 
    handleUpdateTaskStatus 
  } = useTaskStatus(tasks, setTasks);

  return {
    // Dependency management
    handleAddDependency,
    handleRemoveDependency,
    canCompleteTask,
    
    // Subtask management
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    
    // Assignee management
    handleAddAssignee,
    handleRemoveAssignee,
    availableUsers,
    
    // Status management
    handleUpdateTaskStatus
  };
};

export default useAdvancedTaskFeatures;
