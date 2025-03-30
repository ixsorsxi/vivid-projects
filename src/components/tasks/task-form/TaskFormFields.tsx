
import React from 'react';
import { Task } from '@/lib/data';
import {
  TaskBasicFields,
  TaskStatusFields,
  TaskDatePicker,
  TaskProjectSelector
} from './components';
import TaskAssigneeSelector from './components/TaskAssigneeSelector';

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
      
      {/* Assignee selector */}
      <TaskAssigneeSelector
        assignees={newTask.assignees}
        handleChange={handleChange}
      />
      
      {/* Project selector (visible to all users now) */}
      <TaskProjectSelector 
        project={newTask.project} 
        handleChange={handleChange} 
      />
    </div>
  );
};

export default TaskFormFields;
