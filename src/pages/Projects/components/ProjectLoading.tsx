
import React from 'react';

const ProjectLoading: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <p className="text-muted-foreground">Loading project...</p>
    </div>
  );
};

export default ProjectLoading;
