
import React from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { addTaskSubtask, toggleSubtaskCompletion, deleteSubtask } from '@/api/tasks/taskSubtasks';

const useTaskSubtasks = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Add a subtask to a task
  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) {
      toast("Invalid subtask", {
        description: "Subtask title cannot be empty"
      });
      return false;
    }

    const success = await addTaskSubtask(taskId, subtaskTitle);
    
    if (success) {
      // Add to local state with a temporary ID
      const tempId = `temp-${Date.now()}`;
      
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [
              ...(task.subtasks || []),
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
      }));
      
      toast("Subtask added", {
        description: "New subtask has been added"
      });
      return true;
    } else {
      toast("Failed to add subtask", {
        description: "There was an error adding the subtask"
      });
      return false;
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = async (taskId: string, subtaskId: string, completed: boolean) => {
    const success = await toggleSubtaskCompletion(taskId, subtaskId, completed);
    
    if (success) {
      // Update local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks?.map(subtask => 
              subtask.id === subtaskId 
                ? { ...subtask, completed } 
                : subtask
            )
          };
        }
        return task;
      }));
      
      toast("Subtask updated", {
        description: `Subtask marked as ${completed ? 'completed' : 'not completed'}`
      });
      return true;
    } else {
      toast("Failed to update subtask", {
        description: "There was an error updating the subtask"
      });
      return false;
    }
  };

  // Delete a subtask
  const handleDeleteSubtask = async (taskId: string, subtaskId: string) => {
    const success = await deleteSubtask(taskId, subtaskId);
    
    if (success) {
      // Update local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks?.filter(subtask => subtask.id !== subtaskId)
          };
        }
        return task;
      }));
      
      toast("Subtask deleted", {
        description: "Subtask has been removed"
      });
      return true;
    } else {
      toast("Failed to delete subtask", {
        description: "There was an error deleting the subtask"
      });
      return false;
    }
  };

  return {
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask
  };
};

export default useTaskSubtasks;
