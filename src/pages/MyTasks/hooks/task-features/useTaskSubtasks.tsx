
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { Task, Subtask } from '@/lib/types/task';
import { addSubtask, toggleSubtaskCompletion, deleteSubtask } from '@/api/tasks/taskSubtasks';

interface UseTaskSubtasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const useTaskSubtasks = ({ tasks, setTasks }: UseTaskSubtasksProps) => {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isTogglingSubtask, setIsTogglingSubtask] = useState(false);
  const [isDeletingSubtask, setIsDeletingSubtask] = useState(false);

  /**
   * Add a subtask to a task
   */
  const handleTaskSubtaskAdd = useCallback(async (taskId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) {
      toast.error("Invalid subtask", {
        description: "Subtask title cannot be empty"
      });
      return;
    }
    
    setIsAddingSubtask(true);
    
    try {
      // Call API to add subtask
      const newSubtask = await addSubtask(taskId, { title: subtaskTitle });
      
      if (!newSubtask) {
        throw new Error('Failed to create subtask');
      }

      // Update tasks with new subtask
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask]
          };
        }
        return task;
      }));

      toast.success("Subtask added", {
        description: "The subtask has been successfully added"
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast.error("Failed to add subtask", {
        description: "An error occurred while adding the subtask"
      });
    } finally {
      setIsAddingSubtask(false);
    }
  }, [tasks, setTasks]);

  /**
   * Toggle subtask completion status
   */
  const handleToggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    setIsTogglingSubtask(true);
    
    try {
      // Find the current task and subtask
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask || !currentTask.subtasks) {
        throw new Error('Task or subtasks not found');
      }
      
      const currentSubtask = currentTask.subtasks.find(subtask => subtask.id === subtaskId);
      if (!currentSubtask) {
        throw new Error('Subtask not found');
      }
      
      const newCompletionStatus = !currentSubtask.completed;
      
      // Call API to update subtask status
      await toggleSubtaskCompletion(subtaskId, newCompletionStatus);

      // Update task state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: (task.subtasks || []).map(subtask => {
              if (subtask.id === subtaskId) {
                return {
                  ...subtask,
                  completed: newCompletionStatus
                };
              }
              return subtask;
            })
          };
        }
        return task;
      }));

      toast.success("Subtask updated", {
        description: `Subtask marked as ${newCompletionStatus ? 'completed' : 'incomplete'}`
      });
    } catch (error) {
      console.error('Error toggling subtask:', error);
      toast.error("Failed to update subtask", {
        description: "An error occurred while updating the subtask"
      });
    } finally {
      setIsTogglingSubtask(false);
    }
  }, [tasks, setTasks]);

  /**
   * Delete a subtask
   */
  const handleDeleteSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    setIsDeletingSubtask(true);
    
    try {
      // Call API to delete subtask
      const success = await deleteSubtask(subtaskId);
      
      if (!success) {
        throw new Error('Failed to delete subtask');
      }

      // Update tasks by removing the subtask
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: (task.subtasks || []).filter(subtask => subtask.id !== subtaskId)
          };
        }
        return task;
      }));

      toast.success("Subtask deleted", {
        description: "The subtask has been successfully deleted"
      });
    } catch (error) {
      console.error('Error deleting subtask:', error);
      toast.error("Failed to delete subtask", {
        description: "An error occurred while deleting the subtask"
      });
    } finally {
      setIsDeletingSubtask(false);
    }
  }, [tasks, setTasks]);

  return {
    isAddingSubtask,
    isTogglingSubtask,
    isDeletingSubtask,
    handleTaskSubtaskAdd,
    handleToggleSubtask,
    handleDeleteSubtask,
  };
};

export default useTaskSubtasks;
