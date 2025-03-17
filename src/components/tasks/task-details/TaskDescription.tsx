
import React from 'react';

interface TaskDescriptionProps {
  description?: string;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description }) => {
  if (!description) return null;
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-1">Description</h4>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default TaskDescription;
