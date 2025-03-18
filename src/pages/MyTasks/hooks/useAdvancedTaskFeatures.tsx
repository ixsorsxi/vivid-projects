
import React from 'react';
import { Task, Assignee, DependencyType } from '@/lib/types/task';
import useTaskDependencies from './task-features/useTaskDependencies';
import useTaskSubtasks from './task-features/useTaskSubtasks';
import useTaskAssignees from './task-features/useTaskAssignees';
import useTaskStatus from './task-features/useTaskStatus';

const useAdvancedTaskFeatures = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Combine all the individual feature hooks
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
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove,
    availableUsers
  } = useTaskAssignees(tasks, setTasks);
  
  const {
    handleUpdateTaskStatus
  } = useTaskStatus(tasks, setTasks);
  
  return {
    // Dependencies
    handleAddDependency,
    handleRemoveDependency,
    canCompleteTask,
    
    // Subtasks
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    
    // Assignees
    handleAddAssignee: handleTaskAssigneeAdd,
    handleRemoveAssignee: handleTaskAssigneeRemove,
    availableUsers,
    
    // Status
    handleUpdateTaskStatus
  };
};

export default useAdvancedTaskFeatures;
