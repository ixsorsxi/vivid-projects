
import { useState, useCallback } from 'react';
import { Task, TaskStatus } from '@/lib/types/task';
import { toast } from '@/components/ui/toast-wrapper';
import { createTask } from '@/api/tasks';
import { useAuth } from '@/context/auth';
import { v4 as uuidv4 } from 'uuid';

interface UseTaskAddProps {
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsAddTaskOpen?: (open: boolean) => void;
  onSuccess?: (task: Task) => void;
}

const useTaskAdd = ({
  setTasks,
  setIsAddTaskOpen,
  onSuccess
}: UseTaskAddProps = {}) => {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const handleAddTask = useCallback(async (taskData: Partial<Task>) => {
    setIsCreating(true);
    
    try {
      // Make sure assignees have IDs
      const assignees = Array.isArray(taskData.assignees) 
        ? taskData.assignees.map(assignee => {
            if ('id' in assignee) return assignee;
            return { id: uuidv4(), name: assignee.name, avatar: '' };
        })
        : [];

      // Set default status to 'to-do' if not specified
      const status: TaskStatus = taskData.status as TaskStatus || 'to-do';
      
      // Ensure completed flag is set based on status
      const completed = status === 'done';
      
      const newTaskData = {
        ...taskData,
        assignees,
        status,
        completed,
      };
      
      const task = await createTask(newTaskData);
      
      if (task) {
        setTasks?.(prev => [...prev, task]);
        
        toast.success("Task created", {
          description: "New task has been created successfully"
        });
        
        if (setIsAddTaskOpen) {
          setIsAddTaskOpen(false);
        }
        
        if (onSuccess) {
          onSuccess(task);
        }
      }
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error("Failed to create task", {
        description: error.message || "An error occurred while creating the task"
      });
    } finally {
      setIsCreating(false);
    }
  }, [setTasks, setIsAddTaskOpen, onSuccess, user]);

  return {
    isCreating,
    handleAddTask,
  };
};

export default useTaskAdd;
