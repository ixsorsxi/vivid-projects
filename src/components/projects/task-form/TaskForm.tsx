
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast-wrapper";
import TaskFormFields from './TaskFormFields';
import { useTaskForm } from './useTaskForm';
import { TeamMember } from '@/components/projects/team/types';

export interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: () => void;
  teamMembers: TeamMember[];
  newTask: {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
    assignees: Array<{ name: string }>;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
    assignees: Array<{ name: string }>;
  }>>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onOpenChange,
  onAddTask,
  teamMembers,
  newTask,
  setNewTask
}) => {
  const { 
    selectedMember, 
    setSelectedMember, 
    handleAddAssignee, 
    handleRemoveAssignee,
    handleAddTask
  } = useTaskForm({ 
    newTask, 
    setNewTask, 
    onAddTask, 
    onOpenChange 
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for this project.
          </DialogDescription>
        </DialogHeader>
        
        <TaskFormFields
          newTask={newTask}
          setNewTask={setNewTask}
          teamMembers={teamMembers}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
          handleAddAssignee={handleAddAssignee}
          handleRemoveAssignee={handleRemoveAssignee}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleAddTask()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
