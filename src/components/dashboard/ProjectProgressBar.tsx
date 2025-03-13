
import React from 'react';

interface ProjectProgressBarProps {
  progress: number;
}

export const ProjectProgressBar = ({ progress }: ProjectProgressBarProps) => {
  return (
    <div className="mt-5 space-y-1">
      <div className="flex justify-between text-xs">
        <span>Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default ProjectProgressBar;
