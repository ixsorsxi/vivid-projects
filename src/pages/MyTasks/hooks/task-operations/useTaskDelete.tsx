import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { deleteTask } from '@/api/tasks';

const useTaskDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTaskDelete = useCallback(async (taskId: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteTask(taskId);
      if (success) {
        toast.success("Task deleted", {
          description: "The task has been successfully deleted."
        });
      } else {
        toast.error("Failed to delete task", {
          description: "There was an error deleting the task. Please try again."
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Unexpected error", {
        description: "An unexpected error occurred while deleting the task."
      });
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { isDeleting, handleTaskDelete };
};

export default useTaskDelete;
