
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskFormFields from './TaskFormFields';
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
  projectId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onOpenChange,
  onAddTask,
  teamMembers,
  newTask,
  setNewTask,
  projectId
}) => {
  const [selectedMember, setSelectedMember] = React.useState<string>('');

  const handleAddAssignee = () => {
    if (!selectedMember) return;
    
    // Check if already assigned
    if (newTask.assignees.some(a => a.name === selectedMember)) {
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

  return (
    <>
      <TaskFormFields
        newTask={newTask}
        setNewTask={setNewTask}
        teamMembers={teamMembers}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        handleAddAssignee={handleAddAssignee}
        handleRemoveAssignee={handleRemoveAssignee}
        projectId={projectId}
      />
      
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={() => onAddTask()}>
          Create Task
        </Button>
      </DialogFooter>
    </>
  );
};

export default TaskForm;
