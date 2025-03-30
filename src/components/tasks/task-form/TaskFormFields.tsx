
import React from 'react';
import { Task } from '@/lib/data';
import {
  TaskBasicFields,
  TaskStatusFields,
  TaskDatePicker,
  TaskAssigneeDisplay,
  TaskProjectSelector
} from './components';
import { useEffect, useState } from 'react';
import { fetchAvailableUsers } from '@/api/tasks/taskAssignees';

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
  const [availableUsers, setAvailableUsers] = useState<{ id: string, name: string }[]>([]);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchAvailableUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    };

    loadUsers();
  }, []);

  const handleRemoveAssignee = (name: string) => {
    if (newTask.assignees) {
      handleChange('assignees', newTask.assignees.filter(a => a.name !== name));
    }
  };

  const handleAddAssignee = (assignee: { id: string, name: string }) => {
    const currentAssignees = newTask.assignees || [];
    if (!currentAssignees.some(a => a.id === assignee.id)) {
      handleChange('assignees', [...currentAssignees, assignee]);
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
      
      {/* Assignee section */}
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="text-right">Assignees</div>
        <div className="col-span-3">
          {availableUsers.length > 0 ? (
            <TaskAssigneeSelector
              assignees={newTask.assignees || []}
              availableUsers={availableUsers}
              onAssigneeAdd={handleAddAssignee}
              onAssigneeRemove={handleRemoveAssignee}
            />
          ) : (
            <TaskAssigneeDisplay
              assignees={newTask.assignees}
              handleRemoveAssignee={handleRemoveAssignee}
              userRole={userRole}
            />
          )}
        </div>
      </div>
      
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
