
import { useState } from 'react';
import { Task, Assignee } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';

// Add TaskAssignee API functions
const assignUserToTask = async (taskId: string, userId: string): Promise<boolean> => {
  // This is a placeholder - in a real app, you'd make an API call
  console.log(`Assigning user ${userId} to task ${taskId}`);
  
  // Simulate API success
  return Promise.resolve(true);
};

const removeUserFromTask = async (taskId: string, userId: string): Promise<boolean> => {
  // This is a placeholder - in a real app, you'd make an API call
  console.log(`Removing user ${userId} from task ${taskId}`);
  
  // Simulate API success
  return Promise.resolve(true);
};

// Mock function to fetch available users
export const fetchAvailableUsers = async (): Promise<Assignee[]> => {
  // This is a placeholder - in a real app, you'd fetch from your API
  return Promise.resolve([
    { id: 'user-1', name: 'John Doe', avatar: '/avatars/john.jpg' },
    { id: 'user-2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
    { id: 'user-3', name: 'Bob Johnson', avatar: '/avatars/bob.jpg' },
  ]);
};

export const useTaskAssignees = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [availableUsers, setAvailableUsers] = useState<Assignee[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAssigningUser, setIsAssigningUser] = useState(false);
  const [isRemovingUser, setIsRemovingUser] = useState(false);

  // Load available users for assignment
  const loadAvailableUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const users = await fetchAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error("Failed to load users", {
        description: "Could not retrieve available users."
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Add a user to a task
  const handleTaskAssigneeAdd = async (taskId: string, userId: string): Promise<boolean> => {
    if (!taskId || !userId) return false;
    
    setIsAssigningUser(true);
    
    try {
      const success = await assignUserToTask(taskId, userId);
      
      if (success) {
        // Find the user from available users
        const user = availableUsers.find(u => u.id === userId);
        
        if (!user) {
          toast.error("User not found");
          return false;
        }
        
        // Update the tasks state
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === taskId) {
              const existingAssignees = task.assignees || [];
              
              // Check if user is already assigned
              if (existingAssignees.some(a => a.id === userId)) {
                return task;
              }
              
              return {
                ...task,
                assignees: [...existingAssignees, user]
              };
            }
            return task;
          })
        );
        
        toast({
          title: "User assigned",
          description: `${user.name} has been assigned to the task.`
        });
        
        return true;
      }
      
      toast.error("Failed to assign user");
      return false;
    } catch (error) {
      console.error('Error assigning user:', error);
      toast.error("Error assigning user", {
        description: "An unexpected error occurred."
      });
      return false;
    } finally {
      setIsAssigningUser(false);
    }
  };

  // Remove a user from a task
  const handleTaskAssigneeRemove = async (taskId: string, userId: string): Promise<boolean> => {
    setIsRemovingUser(true);
    
    try {
      const success = await removeUserFromTask(taskId, userId);
      
      if (success) {
        // Update the tasks state
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                assignees: (task.assignees || []).filter(a => a.id !== userId)
              };
            }
            return task;
          })
        );
        
        toast({
          title: "User removed",
          description: "User has been removed from the task."
        });
        
        return true;
      }
      
      toast.error("Failed to remove user");
      return false;
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error("Error removing user", {
        description: "An unexpected error occurred."
      });
      return false;
    } finally {
      setIsRemovingUser(false);
    }
  };

  return {
    availableUsers,
    isLoadingUsers,
    isAssigningUser,
    isRemovingUser,
    loadAvailableUsers,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove
  };
};
