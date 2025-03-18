
import React from 'react';

interface TaskDescriptionProps {
  description: string;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description }) => {
  if (!description?.trim()) {
    return (
      <div className="mt-4 text-sm text-muted-foreground italic">
        No description provided
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Description</h4>
      <div className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
        {description}
      </div>
    </div>
  );
};

export default TaskDescription;
