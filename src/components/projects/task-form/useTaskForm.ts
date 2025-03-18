
import { useState } from 'react';
import { toast } from "@/components/ui/toast-wrapper";

interface NewTask {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  status: string;
  assignees: Array<{ name: string }>;
}

interface UseTaskFormProps {
  newTask: NewTask;
  setNewTask: React.Dispatch<React.SetStateAction<NewTask>>;
  onAddTask: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useTaskForm = ({
  newTask,
  setNewTask,
  onAddTask,
  onOpenChange
}: UseTaskFormProps) => {
  const [selectedMember, setSelectedMember] = useState<string>('');

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      });
      return;
    }
    onAddTask();
    onOpenChange(false);
  };

  const handleAddAssignee = () => {
    if (!selectedMember) return;
    
    // Check if already assigned
    if (newTask.assignees.some(a => a.name === selectedMember)) {
      toast.error("Already assigned", {
        description: "This team member is already assigned to the task",
      });
      return;
    }
    
    setNewTask({
      ...newTask,
      assignees: [...newTask.assignees, { name: selectedMember }]
    });
    setSelectedMember('');
  };

  const handleRemoveAssignee = (name: string) => {
    setNewTask({
      ...newTask,
      assignees: newTask.assignees.filter(a => a.name !== name)
    });
  };

  return {
    selectedMember,
    setSelectedMember,
    handleAddAssignee,
    handleRemoveAssignee,
    handleAddTask
  };
};
