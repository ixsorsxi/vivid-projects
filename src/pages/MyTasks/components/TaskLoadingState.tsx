
import React from 'react';
import { Loader } from 'lucide-react';

const TaskLoadingState = () => {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
      <div className="text-center">
        <div className="text-lg font-medium">Loading your tasks...</div>
        <div className="text-sm text-muted-foreground mt-1">This may take a moment</div>
      </div>
    </div>
  );
};

export default TaskLoadingState;
