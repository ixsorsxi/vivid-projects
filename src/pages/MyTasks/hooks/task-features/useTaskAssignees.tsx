
import React from 'react';
import { Task, Assignee } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';

export const useTaskAssignees = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
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

  // Get all available users for assignment
  const availableUsers: Assignee[] = [
    { name: 'Jane Smith', avatar: undefined },
    { name: 'John Doe', avatar: undefined },
    { name: 'Robert Johnson', avatar: undefined },
    { name: 'Michael Brown', avatar: undefined },
    { name: 'Emily Davis', avatar: undefined },
    { name: 'Sarah Williams', avatar: undefined }
  ];

  return {
    handleAddAssignee,
    handleRemoveAssignee,
    availableUsers
  };
};

export default useTaskAssignees;
