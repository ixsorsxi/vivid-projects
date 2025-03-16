
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16 text-muted-foreground">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-8 bg-muted-foreground/30 rounded-full mb-2"></div>
        <p>Loading users...</p>
      </div>
    </div>
  );
};

export default LoadingState;
