
import { useState, useCallback } from 'react';
import { Assignee } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import {
  assignUserToTask, 
  removeUserFromTask, 
  fetchAvailableUsers
} from '@/api/tasks/taskAssignees';

export const useTaskAssignees = (initialAssignees: Assignee[] = []) => {
  const [assignees, setAssignees] = useState<Assignee[]>(initialAssignees);
  const [availableUsers, setAvailableUsers] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch available users
  const loadAvailableUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await fetchAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error loading available users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add assignee
  const addAssignee = useCallback(async (taskId: string, userId: string): Promise<boolean> => {
    try {
      // Call the API to assign the user
      const success = await assignUserToTask(taskId, userId);
      
      if (success) {
        // Find the user in availableUsers
        const user = availableUsers.find(u => u.id === userId);
        if (user) {
          // Add to local state
          const newAssignee: Assignee = {
            id: user.id,
            name: user.name
          };
          
          setAssignees(prev => [...prev, newAssignee]);
          
          toast({
            title: "Assignee added",
            description: `${user.name} has been assigned to the task.`,
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error adding assignee:', error);
      toast.error('Failed to add assignee');
      return false;
    }
  }, [availableUsers]);

  // Remove assignee
  const removeAssignee = useCallback(async (taskId: string, userId: string): Promise<boolean> => {
    try {
      // Call the API to remove the assignment
      const success = await removeUserFromTask(taskId, userId);
      
      if (success) {
        // Remove from local state
        setAssignees(prev => prev.filter(assignee => assignee.id !== userId));
        
        toast({
          title: "Assignee removed",
          description: "The assignee has been removed from the task.",
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error removing assignee:', error);
      toast.error('Failed to remove assignee');
      return false;
    }
  }, []);

  // Initialize - load available users when needed
  const initialize = useCallback(() => {
    loadAvailableUsers();
  }, [loadAvailableUsers]);

  return {
    assignees,
    setAssignees,
    availableUsers,
    isLoading,
    addAssignee,
    removeAssignee,
    initialize
  };
};
