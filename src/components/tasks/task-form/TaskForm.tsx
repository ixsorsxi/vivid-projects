
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from '@/lib/data';
import { useTaskForm } from './useTaskForm';
import TaskFormFields from './TaskFormFields';
import { useAuth } from '@/context/auth';

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
  const { user } = useAuth();
  const userRole = user?.role || 'user';
  
  const {
    newTask,
    errors,
    handleTaskFieldChange,
    handleAddTaskSubmit
  } = useTaskForm({ 
    open, 
    onOpenChange, 
    onAddTask 
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task with details. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <TaskFormFields 
          newTask={newTask} 
          handleChange={handleTaskFieldChange}
          userRole={userRole}
          errors={errors}
        />
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleAddTaskSubmit}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
