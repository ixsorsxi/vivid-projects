
import React from 'react';
import { Task, Assignee } from '@/lib/data';
import TaskBasicFields from './fields/TaskBasicFields';
import TaskStatusPriorityFields from './fields/TaskStatusPriorityFields';
import TaskDateField from './fields/TaskDateField';
import TaskAssigneeField from './fields/TaskAssigneeField';

interface TaskEditFormFieldsProps {
  editedTask: Task;
  setEditedTask: React.Dispatch<React.SetStateAction<Task>>;
  availableUsers: Assignee[];
}

const TaskEditFormFields: React.FC<TaskEditFormFieldsProps> = ({
  editedTask,
  setEditedTask,
  availableUsers
}) => {
  const handleChange = (field: string, value: any) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAssignee = (assignee: Assignee) => {
    if (editedTask.assignees.some(a => a.name === assignee.name)) {
      return;
    }
    
    setEditedTask({
      ...editedTask,
      assignees: [...editedTask.assignees, assignee]
    });
  };
  
  const handleRemoveAssignee = (assigneeName: string) => {
    setEditedTask({
      ...editedTask,
      assignees: editedTask.assignees.filter(a => a.name !== assigneeName)
    });
  };

  return (
    <div className="grid gap-4 py-4">
      <TaskBasicFields 
        title={editedTask.title}
        description={editedTask.description || ''}
        onTitleChange={(value) => handleChange('title', value)}
        onDescriptionChange={(value) => handleChange('description', value)}
      />
      
      <TaskStatusPriorityFields
        status={editedTask.status}
        priority={editedTask.priority}
        onStatusChange={(value) => handleChange('status', value)}
        onPriorityChange={(value) => handleChange('priority', value)}
      />
      
      <TaskDateField 
        dueDate={editedTask.dueDate}
        onDateChange={(value) => handleChange('dueDate', value)}
      />
      
      <TaskAssigneeField
        assignees={editedTask.assignees}
        availableUsers={availableUsers}
        onAssigneeAdd={handleAddAssignee}
        onAssigneeRemove={handleRemoveAssignee}
      />
    </div>
  );
};

export default TaskEditFormFields;
