
import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/lib/types/task';
import { addTaskDependency, removeTaskDependency } from '@/api/tasks/taskDependencies';
import { addTaskSubtask, toggleSubtaskCompletion, deleteSubtask } from '@/api/tasks/taskSubtasks';
import { assignUserToTask, removeUserFromTask, fetchAvailableUsers } from '@/api/tasks/taskAssignees';
import { toast } from '@/components/ui/toast-wrapper';

/**
 * A hook that manages task features like dependencies, subtasks, and assignees
 */
const useTaskFeaturesManager = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  selectedTask: Task | null
) => {
  const [availableUsers, setAvailableUsers] = useState<{ id: string, name: string }[]>([]);

  // Fetch available users for task assignment
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

  // Handle task dependency management
  const handleTaskDependencyAdd = useCallback(async (
    taskId: string,
    dependencyTaskId: string,
    dependencyType: string
  ) => {
    try {
      const success = await addTaskDependency(
        taskId,
        dependencyTaskId,
        dependencyType as any
      );

      if (success) {
        // Optimistically update the tasks list
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === taskId) {
              // Add the new dependency to this task
              const dependencies = task.dependencies || [];
              return {
                ...task,
                dependencies: [
                  ...dependencies,
                  {
                    taskId: dependencyTaskId,
                    type: dependencyType as any
                  }
                ]
              };
            }
            return task;
          });
        });
        
        toast("Dependency added", {
          description: "Task dependency has been added successfully",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding dependency:', error);
      toast.error("Failed to add dependency");
      return false;
    }
  }, [setTasks]);

  const handleTaskDependencyRemove = useCallback(async (
    taskId: string,
    dependencyTaskId: string
  ) => {
    try {
      const success = await removeTaskDependency(taskId, dependencyTaskId);

      if (success) {
        // Optimistically update the tasks list
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === taskId && task.dependencies) {
              return {
                ...task,
                dependencies: task.dependencies.filter(
                  dep => dep.taskId !== dependencyTaskId
                )
              };
            }
            return task;
          });
        });
        
        toast("Dependency removed", {
          description: "Task dependency has been removed successfully",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing dependency:', error);
      toast.error("Failed to remove dependency");
      return false;
    }
  }, [setTasks]);

  // Handle task subtask management
  const handleTaskSubtaskAdd = useCallback(async (
    taskId: string,
    subtaskTitle: string
  ): Promise<boolean> => {
    try {
      const success = await addTaskSubtask(taskId, subtaskTitle);

      if (success) {
        // Generate a temporary ID for optimistic UI update
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Optimistically update the tasks list
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === taskId) {
              const subtasks = task.subtasks || [];
              return {
                ...task,
                subtasks: [
                  ...subtasks,
                  {
                    id: tempId,
                    title: subtaskTitle,
                    completed: false,
                    status: 'to-do',
                    priority: 'medium'
                  }
                ]
              };
            }
            return task;
          });
        });
        
        toast("Subtask added", {
          description: "New subtask has been added successfully",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast.error("Failed to add subtask");
      return false;
    }
  }, [setTasks]);

  const handleToggleSubtask = useCallback(async (
    taskId: string,
    subtaskId: string,
    completed: boolean
  ): Promise<boolean> => {
    try {
      const success = await toggleSubtaskCompletion(taskId, subtaskId, completed);

      if (success) {
        // Optimistically update the tasks list
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === taskId && task.subtasks) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask => {
                  if (subtask.id === subtaskId) {
                    return { ...subtask, completed: !subtask.completed };
                  }
                  return subtask;
                })
              };
            }
            return task;
          });
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error toggling subtask:', error);
      return false;
    }
  }, [setTasks]);

  const handleDeleteSubtask = useCallback(async (
    taskId: string,
    subtaskId: string
  ): Promise<boolean> => {
    try {
      const success = await deleteSubtask(taskId, subtaskId);

      if (success) {
        // Optimistically update the tasks list
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === taskId && task.subtasks) {
              return {
                ...task,
                subtasks: task.subtasks.filter(
                  subtask => subtask.id !== subtaskId
                )
              };
            }
            return task;
          });
        });
        
        toast("Subtask deleted", {
          description: "Subtask has been removed successfully",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting subtask:', error);
      toast.error("Failed to delete subtask");
      return false;
    }
  }, [setTasks]);

  // Handle task assignee management
  const handleTaskAssigneeAdd = useCallback(async (
    taskId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const success = await assignUserToTask(taskId, userId);

      if (success) {
        // Find the user name for the optimistic update
        const user = availableUsers.find(u => u.id === userId);
        if (!user) return false;

        // Optimistically update the tasks list
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === taskId) {
              const assignees = task.assignees || [];
              // Only add if not already assigned
              if (!assignees.some(a => a.id === userId)) {
                return {
                  ...task,
                  assignees: [...assignees, { id: userId, name: user.name }]
                };
              }
            }
            return task;
          });
        });
        
        toast("Assignee added", {
          description: "User has been assigned to this task",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding assignee:', error);
      toast.error("Failed to assign user to task");
      return false;
    }
  }, [availableUsers, setTasks]);

  const handleTaskAssigneeRemove = useCallback(async (
    taskId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const success = await removeUserFromTask(taskId, userId);

      if (success) {
        // Optimistically update the tasks list
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                assignees: (task.assignees || []).filter(
                  assignee => assignee.id !== userId
                )
              };
            }
            return task;
          });
        });
        
        toast("Assignee removed", {
          description: "User has been unassigned from this task",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing assignee:', error);
      toast.error("Failed to remove assignee");
      return false;
    }
  }, [setTasks]);

  return {
    availableUsers,
    handleTaskDependencyAdd,
    handleTaskDependencyRemove,
    handleTaskSubtaskAdd,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove,
  };
};

export default useTaskFeaturesManager;
