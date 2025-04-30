
import { useState, useCallback } from 'react';
import { Task, Assignee } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchAvailableUsers, assignUserToTask, removeUserFromTask } from '@/api/tasks/taskAssignees';

export const useTaskAssignees = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  selectedTask: Task | null
) => {
  const [availableUsers, setAvailableUsers] = useState<Assignee[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Load available users for assignment
  const loadAvailableUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const users = await fetchAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      console.error("Error loading available users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Add assignee to task
  const handleTaskAssigneeAdd = useCallback(async (taskId: string, userId: string): Promise<boolean> => {
    try {
      // Find user from available users
      const user = availableUsers.find(u => u.id === userId);
      if (!user) {
        console.error("User not found in available users");
        return false;
      }

      // Call API to assign user to task
      const success = await assignUserToTask(taskId, userId);
      
      if (success) {
        // Update task state with new assignee
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === taskId) {
              const newAssignees = [...(task.assignees || []), user];
              return {...task, assignees: newAssignees};
            }
            return task;
          })
        );
        
        toast({
          title: "Assignee added",
          description: `${user.name} has been assigned to the task.`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error adding assignee:", error);
      
      toast({
        title: "Error adding assignee",
        description: "There was a problem assigning the user to this task.",
      });
      
      return false;
    }
  }, [availableUsers, setTasks]);

  // Remove assignee from task
  const handleTaskAssigneeRemove = useCallback(async (taskId: string, assigneeId: string): Promise<boolean> => {
    try {
      // Call API to remove user from task
      const success = await removeUserFromTask(taskId, assigneeId);
      
      if (success) {
        // Update task state by removing assignee
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === taskId) {
              const newAssignees = (task.assignees || []).filter(a => a.id !== assigneeId);
              return {...task, assignees: newAssignees};
            }
            return task;
          })
        );
        
        toast({
          title: "Assignee removed",
          description: "The user has been removed from this task.",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error removing assignee:", error);
      
      toast({
        title: "Error removing assignee", 
        description: "There was a problem removing the user from this task."
      });
      
      return false;
    }
  }, [setTasks]);

  return {
    availableUsers,
    isLoadingUsers,
    loadAvailableUsers,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove
  };
};

export default useTaskAssignees;
