
import { useEffect, useState } from 'react';
import { Task } from '@/lib/data';
import { toast } from "@/components/ui/toast-wrapper";

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
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'to-do',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    assignees: [{ name: 'Me' }],
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
        assignees: [{ name: 'Me' }],
        completed: false
      });
    }
  }, [open]);

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

    onAddTask(newTask);
    
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
