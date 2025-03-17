
import { useEffect, useState } from 'react';
import { Task } from '@/lib/data';
import { toast } from "@/components/ui/toast-wrapper";
import { useAuth } from '@/context/auth';

interface UseTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Partial<Task>) => void;
}

export const useTaskForm = ({
  open,
  onOpenChange,
  onAddTask
}: UseTaskFormProps) => {
  const { user } = useAuth();
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'to-do',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    assignees: [{ name: user?.profile?.full_name || 'Me' }],
    completed: false
  });

  useEffect(() => {
    if (open) {
      // Reset form when opened
      setNewTask({
        title: '',
        description: '',
        status: 'to-do',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        assignees: [{ name: user?.profile?.full_name || 'Me' }],
        completed: false
      });
    }
  }, [open, user]);

  const handleTaskFieldChange = (field: string, value: any) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTaskSubmit = () => {
    if (!newTask.title) {
      toast.error("Error", {
        description: "Task title is required",
      });
      return;
    }

    // Ensure we're setting user data properly
    const taskToSubmit = {
      ...newTask,
      // Don't need to set user_id explicitly here as the API function will handle it
    };
    
    console.log("Submitting task:", taskToSubmit);
    
    onAddTask(taskToSubmit);
    
    // Form will be reset in the useEffect when dialog closes
    onOpenChange(false);
    
    toast("Success", {
      description: "New task has been added",
    });
  };

  return {
    newTask,
    handleTaskFieldChange,
    handleAddTaskSubmit
  };
};
