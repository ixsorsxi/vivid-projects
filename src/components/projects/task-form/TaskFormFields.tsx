
import React from 'react';
import { TeamMember } from '@/components/projects/team/types';
import {
  TaskTitleField,
  TaskDescriptionField,
  TaskStatusSelector,
  TaskPrioritySelector,
  TaskDatePicker,
  TaskAssigneeSelector
} from './components';

interface TaskFormFieldsProps {
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
  teamMembers: TeamMember[];
  selectedMember: string;
  setSelectedMember: React.Dispatch<React.SetStateAction<string>>;
  handleAddAssignee: () => void;
  handleRemoveAssignee: (name: string) => void;
  projectId?: string;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  newTask,
  setNewTask,
  teamMembers,
  selectedMember,
  setSelectedMember,
  handleAddAssignee,
  handleRemoveAssignee,
  projectId
}) => {
  // Handler for date change
  const onDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setNewTask({ ...newTask, dueDate: formattedDate });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <TaskTitleField 
        title={newTask.title} 
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
      />
      
      <TaskDescriptionField 
        description={newTask.description} 
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
      />
      
      <TaskStatusSelector 
        status={newTask.status} 
        onValueChange={(value) => setNewTask({ ...newTask, status: value })} 
      />
      
      <TaskPrioritySelector 
        priority={newTask.priority} 
        onValueChange={(value) => setNewTask({ ...newTask, priority: value })} 
      />
      
      <TaskDatePicker 
        dueDate={newTask.dueDate} 
        onDateChange={onDateChange} 
      />
      
      <TaskAssigneeSelector 
        assignees={newTask.assignees}
        projectId={projectId}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        handleAddAssignee={handleAddAssignee}
        handleRemoveAssignee={handleRemoveAssignee}
      />
    </div>
  );
};

export default TaskFormFields;
