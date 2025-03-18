
import React from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchAvailableUsers, assignUserToTask, removeUserFromTask } from '@/api/tasks/taskAssignees';

const useTaskAssignees = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [availableUsers, setAvailableUsers] = React.useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const users = await fetchAvailableUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Add assignee to task
  const handleTaskAssigneeAdd = async (taskId: string, userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (!user) {
      toast("Invalid user", {
        description: "The selected user was not found"
      });
      return false;
    }

    // Check if user is already assigned
    const task = tasks.find(t => t.id === taskId);
    if (task?.assignees?.some(a => a.name === user.name)) {
      toast("Already assigned", {
        description: "This user is already assigned to the task"
      });
      return false;
    }

    const success = await assignUserToTask(taskId, userId);
    
    if (success) {
      // Update local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: [
              ...(task.assignees || []),
              { name: user.name }
            ]
          };
        }
        return task;
      }));
      
      toast("Assignee added", {
        description: `${user.name} has been assigned to the task`
      });
      return true;
    } else {
      toast("Failed to add assignee", {
        description: "There was an error assigning the user"
      });
      return false;
    }
  };

  // Remove assignee from task
  const handleTaskAssigneeRemove = async (taskId: string, userName: string) => {
    // Find user ID by name
    const user = availableUsers.find(u => u.name === userName);
    if (!user) {
      // Just remove from local state if user not found in available users
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: task.assignees?.filter(a => a.name !== userName) || []
          };
        }
        return task;
      }));
      return true;
    }

    const success = await removeUserFromTask(taskId, user.id);
    
    if (success) {
      // Update local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: task.assignees?.filter(a => a.name !== userName) || []
          };
        }
        return task;
      }));
      
      toast("Assignee removed", {
        description: `${userName} has been removed from the task`
      });
      return true;
    } else {
      toast("Failed to remove assignee", {
        description: "There was an error removing the assignee"
      });
      return false;
    }
  };

  return {
    availableUsers,
    isLoading,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove
  };
};

export default useTaskAssignees;
