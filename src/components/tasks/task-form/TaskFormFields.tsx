
import React from 'react';
import { Task } from '@/lib/data';
import {
  TaskBasicFields,
  TaskStatusFields,
  TaskDatePicker,
  TaskAssigneeDisplay,
  TaskTeamSelector,
  TaskProjectSelector
} from './components';

interface TaskFormFieldsProps {
  newTask: Partial<Task>;
  handleChange: (field: string, value: any) => void;
  userRole?: 'admin' | 'manager' | 'user' | string;
  errors?: {
    title?: string;
  };
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  newTask,
  handleChange,
  userRole = 'user',
  errors
}) => {
  const handleRemoveAssignee = (name: string) => {
    if (newTask.assignees) {
      handleChange('assignees', newTask.assignees.filter(a => a.name !== name));
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Basic information fields */}
      <TaskBasicFields
        title={newTask.title || ''}
        description={newTask.description || ''}
        handleChange={handleChange}
        errors={errors}
      />
      
      {/* Status and priority fields */}
      <TaskStatusFields
        status={newTask.status || 'to-do'}
        priority={newTask.priority || 'medium'}
        handleChange={handleChange}
      />
      
      {/* Date picker */}
      <TaskDatePicker
        dueDate={newTask.dueDate}
        handleChange={handleChange}
      />
      
      {/* Assignee display */}
      <TaskAssigneeDisplay
        assignees={newTask.assignees}
        handleRemoveAssignee={handleRemoveAssignee}
        userRole={userRole}
      />
      
      {/* Show team member selector for admin/manager roles */}
      {(userRole === 'admin' || userRole === 'manager') && (
        <TaskTeamSelector handleChange={handleChange} />
      )}

      {/* Show advanced options for admin role */}
      {userRole === 'admin' && (
        <TaskProjectSelector 
          project={newTask.project} 
          handleChange={handleChange} 
        />
      )}
    </div>
  );
};

export default TaskFormFields;
