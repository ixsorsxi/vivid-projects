
import { useEffect, useState } from 'react';
import { Task } from '@/lib/data';
import { toast } from "@/components/ui/toast-wrapper";
import { useAuth } from '@/context/auth';

interface UseTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Partial<Task>) => void;
}

interface FormErrors {
  title?: string;
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
    assignees: user?.profile ? [{ id: user.id, name: user.profile.full_name || 'Me' }] : [],
    completed: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      // Reset form when opened
      setNewTask({
        title: '',
        description: '',
        status: 'to-do',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        assignees: user?.profile ? [{ id: user.id, name: user.profile.full_name || 'Me' }] : [],
        completed: false
      });
      setErrors({});
    }
  }, [open, user]);

  const handleTaskFieldChange = (field: string, value: any) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!newTask.title || newTask.title.trim() === '') {
      newErrors.title = "Task title is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTaskSubmit = () => {
    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form",
      });
      return;
    }

    // Ensure assignees is always an array with at least the current user
    if (!newTask.assignees || newTask.assignees.length === 0) {
      newTask.assignees = user?.profile ? [{ id: user.id, name: user.profile.full_name || 'Me' }] : [];
    }
    
    console.log("Submitting task:", newTask);
    
    onAddTask(newTask);
    
    // Form will be reset in the useEffect when dialog closes
    onOpenChange(false);
  };

  return {
    newTask,
    errors,
    handleTaskFieldChange,
    handleAddTaskSubmit
  };
};
