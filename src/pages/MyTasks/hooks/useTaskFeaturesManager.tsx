
import { useState, useEffect } from 'react';
import { Task } from '@/lib/types/task';
import { fetchAvailableUsers } from '@/api/tasks/taskAssignees';
import { toast } from '@/components/ui/toast-wrapper';
import useTaskSubtasks from './task-features/useTaskSubtasks';
import useTaskAssignees from './task-features/useTaskAssignees';
import { useTaskDependencies } from './task-features/useTaskDependencies';
import { useTaskStatus } from './task-features/useTaskStatus';

/**
 * A hook that manages task features like dependencies, subtasks, and assignees
 */
const useTaskFeaturesManager = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  selectedTask: Task | null
) => {
  const [availableUsers, setAvailableUsers] = useState<{ id: string, name: string }[]>([]);

  // Load available users for task assignment
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchAvailableUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    };

    loadUsers();
  }, []);

  // Use the feature-specific hooks
  const { handleAddDependency, handleRemoveDependency } = useTaskDependencies(tasks, setTasks);
  const { handleAddSubtask, handleToggleSubtask, handleDeleteSubtask } = useTaskSubtasks(tasks, setTasks);
  const { handleTaskAssigneeAdd, handleTaskAssigneeRemove } = useTaskAssignees(tasks, setTasks);
  const { handleUpdateTaskStatus } = useTaskStatus(tasks, setTasks);

  return {
    availableUsers,
    handleTaskDependencyAdd: handleAddDependency,
    handleTaskDependencyRemove: handleRemoveDependency,
    handleTaskSubtaskAdd: handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove,
    handleUpdateTaskStatus
  };
};

export default useTaskFeaturesManager;
