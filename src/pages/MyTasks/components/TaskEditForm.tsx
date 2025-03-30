
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, Assignee } from '@/lib/data';
import { TaskEditFormFields } from './task-edit-form';

interface TaskEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdateTask: (task: Task) => void;
  availableUsers?: Assignee[];
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  open,
  onOpenChange,
  task,
  onUpdateTask,
  availableUsers = [
    { name: 'Jane Smith' },
    { name: 'John Doe' },
    { name: 'Robert Johnson' },
    { name: 'Michael Brown' },
    { name: 'Emily Davis' },
    { name: 'Sarah Williams' }
  ]
}) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  
  // Set up task data when opening
  useEffect(() => {
    if (task && open) {
      setEditedTask({ ...task });
    }
  }, [task, open]);
  
  // Clean up on unmount or navigation
  useEffect(() => {
    return () => {
      // Ensure dialog is closed when component unmounts
      if (open) {
        setTimeout(() => {
          onOpenChange(false);
        }, 0);
      }
    };
  }, []);
  
  if (!editedTask) return null;
  
  const handleSubmit = () => {
    if (editedTask) {
      onUpdateTask(editedTask);
    }
    onOpenChange(false);
  };
  
  const handleSafeDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Use timeout to ensure state updates properly
      setTimeout(() => {
        onOpenChange(isOpen);
      }, 50);
    } else {
      onOpenChange(isOpen);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleSafeDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <TaskEditFormFields
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          availableUsers={availableUsers}
        />
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditForm;
