
import { useState, useCallback } from 'react';
import { Task, Assignee } from '@/lib/data/types';
import { toast } from '@/components/ui/toast-wrapper';
import { assignUserToTask, removeUserFromTask } from '@/api/tasks/taskAssignees';

/**
 * Hook for managing task assignees
 */
export const useTaskAssignees = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [availableUsers, setAvailableUsers] = useState<Assignee[]>([
    { id: 'u1', name: 'Alex Johnson', avatar: '/avatars/user1.png' },
    { id: 'u2', name: 'Sarah Wilson', avatar: '/avatars/user2.png' },
    { id: 'u3', name: 'David Chen', avatar: '/avatars/user3.png' },
    { id: 'u4', name: 'Lisa Park', avatar: '/avatars/user4.png' },
    { id: 'u5', name: 'Michael Roberts', avatar: '/avatars/user5.png' }
  ]);

  // Add assignee to a task
  const handleTaskAssigneeAdd = useCallback(async (taskId: string, assignee: Assignee) => {
    // Call API to assign user
    const success = await assignUserToTask(taskId, assignee.id);
    
    if (success) {
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            // Check if assignee is already assigned
            const isAlreadyAssigned = task.assignees?.some(a => a.id === assignee.id);
            
            if (isAlreadyAssigned) {
              return task;
            }
            
            const updatedAssignees = [...(task.assignees || []), assignee];
            return { ...task, assignees: updatedAssignees };
          }
          return task;
        });
      });
      
      toast.success(`Assignee added`, {
        description: `${assignee.name} has been assigned to the task.`
      });
      return true;
    } else {
      toast.error(`Failed to add assignee`, {
        description: `There was an error assigning ${assignee.name} to the task.`
      });
      return false;
    }
  }, [setTasks]);

  // Remove assignee from a task
  const handleTaskAssigneeRemove = useCallback(async (taskId: string, assigneeId: string) => {
    const success = await removeUserFromTask(taskId, assigneeId);
    
    if (success) {
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            const updatedAssignees = task.assignees?.filter(a => a.id !== assigneeId) || [];
            return { ...task, assignees: updatedAssignees };
          }
          return task;
        });
      });
      
      toast.success(`Assignee removed`, {
        description: `User has been unassigned from the task.`
      });
      return true;
    } else {
      toast.error(`Failed to remove assignee`, {
        description: `There was an error removing the assignee from the task.`
      });
      return false;
    }
  }, [setTasks]);

  return {
    availableUsers,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove
  };
};

export default useTaskAssignees;
