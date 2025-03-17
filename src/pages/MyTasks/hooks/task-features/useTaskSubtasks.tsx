
import React from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { addTaskSubtask, toggleSubtaskCompletion, deleteSubtask } from '@/api/tasks';

export const useTaskSubtasks = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Handle adding a subtask
  const handleAddSubtask = async (parentId: string, title: string) => {
    // Add subtask to the database
    const success = await addTaskSubtask(parentId, title);
    
    if (success) {
      // Create a temporary ID and update the state
      const tempId = `temp-${Date.now()}`;
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === parentId) {
            const subtasks = task.subtasks || [];
            const newSubtask = {
              id: tempId,
              title,
              status: 'to-do',
              priority: 'medium',
              dueDate: task.dueDate,
              project: task.project,
              assignees: [],
              completed: false,
              parentId
            };
            
            return {
              ...task,
              subtasks: [...subtasks, newSubtask]
            };
          }
          return task;
        });
      });
      
      toast("Subtask added", {
        description: `"${title}" has been added as a subtask`,
      });
      
      return true;
    }
    
    return false;
  };
  
  // Handle toggling a subtask's completion status
  const handleToggleSubtask = async (subtaskId: string) => {
    // Toggle subtask completion in the database
    const success = await toggleSubtaskCompletion(subtaskId);
    
    if (success) {
      // Update state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.subtasks) {
            const updatedSubtasks = task.subtasks.map(subtask => {
              if (subtask.id === subtaskId) {
                return {
                  ...subtask,
                  status: subtask.status === 'completed' ? 'to-do' : 'completed',
                  completed: !subtask.completed
                };
              }
              return subtask;
            });
            
            return {
              ...task,
              subtasks: updatedSubtasks
            };
          }
          return task;
        });
      });
      
      return true;
    }
    
    return false;
  };
  
  // Handle deleting a subtask
  const handleDeleteSubtask = async (subtaskId: string) => {
    // Delete subtask from the database
    const success = await deleteSubtask(subtaskId);
    
    if (success) {
      // Update state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.subtasks) {
            return {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
            };
          }
          return task;
        });
      });
      
      toast("Subtask deleted", {
        description: "The subtask has been removed",
      });
      
      return true;
    }
    
    return false;
  };

  return {
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask
  };
};

export default useTaskSubtasks;
