
import React from 'react';
import { Task } from '@/lib/data';
import useAdvancedTaskFeatures from './useAdvancedTaskFeatures';

export const useTaskFeaturesManager = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  selectedTask: Task | null
) => {
  const {
    handleAddDependency,
    handleRemoveDependency,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleAddAssignee,
    handleRemoveAssignee,
    availableUsers
  } = useAdvancedTaskFeatures(tasks, setTasks);

  const handleTaskDependencyAdd = (taskId: string, dependencyType: string) => {
    if (selectedTask) {
      handleAddDependency(selectedTask.id, taskId, dependencyType as any);
    }
  };

  const handleTaskDependencyRemove = (dependencyTaskId: string) => {
    if (selectedTask) {
      handleRemoveDependency(selectedTask.id, dependencyTaskId);
    }
  };

  const handleTaskSubtaskAdd = (parentId: string, title: string) => {
    handleAddSubtask(parentId, title);
  };

  const handleTaskAssigneeAdd = (taskId: string, assignee: any) => {
    handleAddAssignee(taskId, assignee);
  };

  const handleTaskAssigneeRemove = (taskId: string, assigneeName: string) => {
    handleRemoveAssignee(taskId, assigneeName);
  };

  return {
    handleTaskDependencyAdd,
    handleTaskDependencyRemove,
    handleTaskSubtaskAdd,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove,
    availableUsers
  };
};

export default useTaskFeaturesManager;
