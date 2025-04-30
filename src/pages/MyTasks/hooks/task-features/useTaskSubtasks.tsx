
import { useState } from 'react';
import { Task, Subtask } from '@/lib/types/task';
import { addSubtask, deleteSubtask, toggleSubtaskCompletion } from '@/api/tasks/taskSubtasks';
import { toast } from '@/components/ui/toast-wrapper';

export const useTaskSubtasks = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isDeletingSubtask, setIsDeletingSubtask] = useState(false);
  const [isTogglingSubtask, setIsTogglingSubtask] = useState(false);

  // Add a new subtask to a task
  const handleTaskSubtaskAdd = async (taskId: string, subtaskTitle: string): Promise<boolean> => {
    if (!subtaskTitle.trim()) return false;
    
    setIsAddingSubtask(true);
    
    try {
      const result = await addSubtask(taskId, subtaskTitle);
      
      if (result) {
        // Update the task in the list
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), result]
              };
            }
            return task;
          })
        );
        
        toast({
          title: "Subtask added",
          description: `"${subtaskTitle}" has been added.`
        });
        
        return true;
      }
      
      toast.error("Failed to add subtask");
      return false;
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast.error("Error adding subtask");
      return false;
    } finally {
      setIsAddingSubtask(false);
    }
  };

  // Delete a subtask
  const handleDeleteSubtask = async (taskId: string, subtaskId: string): Promise<boolean> => {
    setIsDeletingSubtask(true);
    
    try {
      const result = await deleteSubtask(subtaskId);
      
      if (result) {
        // Update the tasks list
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: task.subtasks?.filter(st => st.id !== subtaskId) || []
              };
            }
            return task;
          })
        );
        
        toast({
          title: "Subtask deleted",
          description: "The subtask has been removed."
        });
        
        return true;
      }
      
      toast.error("Failed to delete subtask");
      return false;
    } catch (error) {
      console.error('Error deleting subtask:', error);
      toast.error("Error deleting subtask");
      return false;
    } finally {
      setIsDeletingSubtask(false);
    }
  };

  // Toggle a subtask's completion status
  const handleToggleSubtask = async (taskId: string, subtaskId: string, completed: boolean): Promise<boolean> => {
    setIsTogglingSubtask(true);
    
    try {
      const success = await toggleSubtaskCompletion(subtaskId, completed);
      
      if (success) {
        // Update the tasks list
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: task.subtasks?.map(st => 
                  st.id === subtaskId ? { ...st, completed } : st
                ) || []
              };
            }
            return task;
          })
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling subtask:', error);
      return false;
    } finally {
      setIsTogglingSubtask(false);
    }
  };

  return {
    isAddingSubtask,
    isDeletingSubtask,
    isTogglingSubtask,
    handleTaskSubtaskAdd,
    handleDeleteSubtask,
    handleToggleSubtask
  };
};
