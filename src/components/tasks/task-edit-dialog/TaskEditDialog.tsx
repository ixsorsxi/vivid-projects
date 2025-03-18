
import React, { useState, useEffect } from 'react';
import { Task } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TaskFormFields from '../task-form/TaskFormFields';

interface TaskEditDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (task: Task) => void;
  onCancel?: () => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  task,
  open,
  onOpenChange,
  onUpdateTask,
  onCancel
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  
  useEffect(() => {
    setEditedTask(task);
  }, [task, open]);
  
  const handleTaskFieldChange = (field: string, value: any) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = () => {
    onUpdateTask(editedTask);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <TaskFormFields
            newTask={editedTask}
            handleChange={handleTaskFieldChange}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
