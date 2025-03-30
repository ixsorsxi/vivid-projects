
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
      
      const newTask = await createTask(preparedTask, user.id);
      
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
