
import React from 'react';
import { Task, Assignee } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchAvailableUsers } from '@/api/tasks';

export const useTaskAssignees = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [availableUsers, setAvailableUsers] = React.useState<Assignee[]>([]);

  // Fetch available users when the hook mounts
  React.useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchAvailableUsers();
      setAvailableUsers(users);
    };
    
    loadUsers();
  }, []);
  
  // Add an assignee to a task
  const handleAddAssignee = (taskId: string, assignee: Assignee) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          // Check if assignee already exists
          if (task.assignees.some(a => a.name === assignee.name)) {
            return task;
          }
          
          return {
            ...task,
            assignees: [...task.assignees, assignee]
          };
        }
        return task;
      });
    });
    
    toast("Assignee added", {
      description: `${assignee.name} has been assigned to the task`,
    });
  };
  
  // Remove an assignee from a task
  const handleRemoveAssignee = (taskId: string, assigneeName: string) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: task.assignees.filter(a => a.name !== assigneeName)
          };
        }
        return task;
      });
    });
    
    toast("Assignee removed", {
      description: `${assigneeName} has been removed from the task`,
    });
  };

  return {
    handleAddAssignee,
    handleRemoveAssignee,
    availableUsers
  };
};

export default useTaskAssignees;
