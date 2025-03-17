
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from '@/lib/data';
import { useTaskForm } from './useTaskForm';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Partial<Task>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onOpenChange,
  onAddTask
}) => {
  const {
    newTask,
    handleTaskFieldChange,
    handleAddTaskSubmit
  } = useTaskForm({ 
    open, 
    onOpenChange, 
    onAddTask 
  });

  // Import the TaskFormFields component dynamically to avoid circular imports
  const TaskFormFields = React.lazy(() => import('./TaskFormFields'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task with details. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <React.Suspense fallback={<div>Loading form fields...</div>}>
          <TaskFormFields 
            newTask={newTask} 
            handleChange={handleTaskFieldChange} 
          />
        </React.Suspense>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleAddTaskSubmit}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
