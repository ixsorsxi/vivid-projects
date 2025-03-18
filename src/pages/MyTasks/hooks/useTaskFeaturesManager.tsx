
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
  
  // Task subtasks handling (placeholder - to be implemented)
  const handleTaskSubtaskAdd = (taskId: string, subtaskTitle: string) => {
    console.log('Add subtask:', taskId, subtaskTitle);
    return Promise.resolve(true);
  };
  
  const handleToggleSubtask = (taskId: string, subtaskId: string, completed: boolean) => {
    console.log('Toggle subtask:', taskId, subtaskId, completed);
    return Promise.resolve(true);
  };
  
  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    console.log('Delete subtask:', taskId, subtaskId);
    return Promise.resolve(true);
  };
  
  // Task assignees handling (placeholder - to be implemented)
  const handleTaskAssigneeAdd = (taskId: string, userId: string) => {
    console.log('Add assignee:', taskId, userId);
    return Promise.resolve(true);
  };
  
  const handleTaskAssigneeRemove = (taskId: string, userId: string) => {
    console.log('Remove assignee:', taskId, userId);
    return Promise.resolve(true);
  };
  
  // Available users for task assignment (mock data - to be replaced with actual users)
  const availableUsers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Adam Jones' }
  ];

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
