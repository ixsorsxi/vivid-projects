
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { Task, Assignee } from '@/lib/types/task';
import { User } from '@/lib/types/auth';

interface UseTaskAssigneesProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const useTaskAssignees = ({ tasks, setTasks }: UseTaskAssigneesProps) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/01.png' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatars/02.png' },
    { id: '3', name: 'Alex Johnson', email: 'alex@example.com', avatar: '/avatars/03.png' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: '/avatars/04.png' },
  ]);
  
  const [isAddingAssignee, setIsAddingAssignee] = useState(false);
  const [isRemovingAssignee, setIsRemovingAssignee] = useState(false);

  /**
   * Add an assignee to a task
   */
  const handleTaskAssigneeAdd = useCallback(async (taskId: string, userId: string) => {
    setIsAddingAssignee(true);
    
    try {
      // Find the task we need to update
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) {
        console.error('Task not found:', taskId);
        return;
      }

      // Find the user to add as assignee
      const userToAdd = availableUsers.find(user => user.id === userId);
      if (!userToAdd) {
        console.error('User not found:', userId);
        return;
      }

      // Check if the user is already assigned to the task
      const isAlreadyAssigned = taskToUpdate.assignees?.some(assignee => assignee.id === userId);
      if (isAlreadyAssigned) {
        toast.error("User already assigned", {
          description: "This user is already assigned to the task"
        });
        return;
      }

      // Create a new assignee object
      const newAssignee: Assignee = {
        id: userToAdd.id,
        name: userToAdd.name,
        avatar: userToAdd.avatar
      };

      // Update the tasks array
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: [...(task.assignees || []), newAssignee]
          };
        }
        return task;
      }));

      toast.success("Assignee added", {
        description: `${userToAdd.name} has been assigned to the task`
      });
    } catch (error) {
      console.error('Error adding assignee:', error);
      toast.error("Failed to add assignee", {
        description: "An error occurred while adding the assignee"
      });
    } finally {
      setIsAddingAssignee(false);
    }
  }, [tasks, setTasks, availableUsers]);

  /**
   * Remove an assignee from a task
   */
  const handleTaskAssigneeRemove = useCallback(async (taskId: string, assigneeId: string) => {
    setIsRemovingAssignee(true);
    
    try {
      // Find the task we need to update
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) {
        console.error('Task not found:', taskId);
        return;
      }

      // Find the assignee to remove
      const assigneeToRemove = taskToUpdate.assignees?.find(assignee => assignee.id === assigneeId);
      if (!assigneeToRemove) {
        console.error('Assignee not found:', assigneeId);
        toast.error("Assignee not found", {
          description: "Could not find the assignee to remove"
        });
        return;
      }

      // Update the tasks array
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: (task.assignees || []).filter(assignee => assignee.id !== assigneeId)
          };
        }
        return task;
      }));

      toast.success("Assignee removed", {
        description: `${assigneeToRemove.name} has been removed from the task`
      });
    } catch (error) {
      console.error('Error removing assignee:', error);
      toast.error("Failed to remove assignee", {
        description: "An error occurred while removing the assignee"
      });
    } finally {
      setIsRemovingAssignee(false);
    }
  }, [tasks, setTasks]);

  return {
    availableUsers,
    isAddingAssignee,
    isRemovingAssignee,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove,
  };
};

export default useTaskAssignees;
