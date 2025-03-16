
import React from 'react';

const TaskLoadingState = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-32 mx-auto"></div>
        <div className="h-4 bg-slate-200 rounded w-48 mx-auto"></div>
        <div className="flex justify-center mt-4">
          <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskLoadingState;
