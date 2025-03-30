
import { useState } from 'react';
import { Task } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { createTask } from '@/api/tasks';
import { useAuth } from '@/context/auth';

interface UseTaskAddProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useTaskAdd = ({ setTasks, setIsAddTaskOpen }: UseTaskAddProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { user } = useAuth();

  const handleAddTask = async (task: Partial<Task>) => {
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be logged in to add tasks",
      });
      return;
    }

    if (!task.title || task.title.trim() === '') {
      toast.error("Task title required", {
        description: "Please provide a title for the task",
      });
      return;
    }

    setIsAddingTask(true);
    try {
      console.log("Creating task with data:", task);
      
      // Ensure the task has the proper structure before sending to the API
      const preparedTask: Omit<Task, 'id'> = {
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'to-do',
        priority: task.priority || 'medium',
        dueDate: task.dueDate,
        project: task.project,
        assignees: task.assignees || [{ name: user.profile?.full_name || 'Me' }],
        completed: task.status === 'completed' || false
      };
      
      // Log the user ID for debugging
      console.log(`Adding task for user: ${user.id}`);
      
      const newTask = await createTask(preparedTask, user.id);
      
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast.success("Task added", {
          description: "New task has been added successfully",
        });
        setIsAddTaskOpen(false);
      } else {
        toast.error("Error", {
          description: "Failed to add task. Please check console for details.",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error", {
        description: "Failed to add task due to an unexpected error",
      });
    } finally {
      setIsAddingTask(false);
    }
  };

  return { handleAddTask, isAddingTask };
};

export default useTaskAdd;
