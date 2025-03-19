import { useState } from 'react';
import { Task } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';

// Update the import for createTask
import { createTask } from '@/api/tasks';

interface UseTaskAddProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useTaskAdd = ({ setTasks, setIsAddTaskOpen }: UseTaskAddProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = async (task: Partial<Task>) => {
    setIsAddingTask(true);
    try {
      const newTask = await createTask(task as Omit<Task, 'id'>);
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast.success("Task added", {
          description: "New task has been added successfully",
        });
      } else {
        toast.error("Error", {
          description: "Failed to add task",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error", {
        description: "Failed to add task due to an unexpected error",
      });
    } finally {
      setIsAddingTask(false);
      setIsAddTaskOpen(false);
    }
  };

  return { handleAddTask, isAddingTask };
};

export default useTaskAdd;
