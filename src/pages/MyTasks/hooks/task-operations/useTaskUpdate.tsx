import { useState, useCallback } from 'react';
import { Task } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { updateTask } from '@/api/tasks';

interface UseTaskUpdateProps {
  onTaskUpdateSuccess?: (updatedTask: Task) => void;
  onTaskUpdateError?: (error: string) => void;
}

const useTaskUpdate = ({ onTaskUpdateSuccess, onTaskUpdateError }: UseTaskUpdateProps = {}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateTask = useCallback(async (task: Task) => {
    setIsUpdating(true);
    try {
      const updatedTask = await updateTask(task.id, task);
      if (updatedTask) {
        toast.success("Task updated", {
          description: "Task has been updated successfully",
        });
        onTaskUpdateSuccess?.(updatedTask);
      } else {
        toast.error("Failed to update task", {
          description: "An error occurred while updating the task",
        });
        onTaskUpdateError?.("Failed to update task");
      }
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
      onTaskUpdateError?.(error.message || "An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  }, [onTaskUpdateSuccess, onTaskUpdateError]);

  return { isUpdating, handleUpdateTask };
};

export default useTaskUpdate;
