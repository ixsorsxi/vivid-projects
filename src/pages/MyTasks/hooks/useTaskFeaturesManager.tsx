
import React from 'react';
import { Task } from '@/lib/data';
import useTaskDependencies from './task-features/useTaskDependencies';
import useTaskSubtasks from './task-features/useTaskSubtasks';
import useTaskAssignees from './task-features/useTaskAssignees';
import useTaskStatus from './task-features/useTaskStatus';

export const useTaskFeaturesManager = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  selectedTask: Task | null
) => {
  // Task dependencies handling
  const {
    handleAddDependency: handleTaskDependencyAdd,
    handleRemoveDependency: handleTaskDependencyRemove,
    canCompleteTask
  } = useTaskDependencies(tasks, setTasks);
  
  // Task status handling
  const {
    handleUpdateTaskStatus
  } = useTaskStatus(tasks, setTasks);
  
  // Task subtasks handling
  const {
    handleAddSubtask: handleTaskSubtaskAdd,
    handleToggleSubtask,
    handleDeleteSubtask
  } = useTaskSubtasks(tasks, setTasks);
  
  // Task assignees handling
  const {
    availableUsers,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove
  } = useTaskAssignees(tasks, setTasks);

  return {
    // Dependencies
    handleTaskDependencyAdd,
    handleTaskDependencyRemove,
    canCompleteTask,
    
    // Status
    handleUpdateTaskStatus,
    
    // Subtasks
    handleTaskSubtaskAdd,
    handleToggleSubtask,
    handleDeleteSubtask,
    
    // Assignees
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove,
    availableUsers
  };
};

export default useTaskFeaturesManager;
