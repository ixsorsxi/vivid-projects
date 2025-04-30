
import React from 'react';
import { Assignee } from '@/lib/types/task';

interface TaskAssigneeSelectorProps {
  assignees: Assignee[];
  handleChange: (field: string, value: any) => void;
}

const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({ assignees, handleChange }) => {
  return (
    <div>
      <label htmlFor="assignees" className="block text-sm font-medium mb-1">Assignees</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {assignees && assignees.length > 0 ? (
          assignees.map((assignee, index) => (
            <div key={assignee.id || index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center">
              {assignee.name}
              <button
                type="button"
                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                onClick={() => {
                  const newAssignees = assignees.filter((_, i) => i !== index);
                  handleChange('assignees', newAssignees);
                }}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">No assignees</div>
        )}
      </div>
      <button
        type="button"
        className="text-sm text-primary hover:text-primary/80"
        onClick={() => {
          // In a real implementation, we'd show a user selection dialog
          // For now, we'll just add a placeholder assignee
          const newAssignee: Assignee = { id: `user-${Date.now()}`, name: `User ${assignees.length + 1}` };
          handleChange('assignees', [...assignees, newAssignee]);
        }}
      >
        + Add assignee
      </button>
    </div>
  );
};

export default TaskAssigneeSelector;
