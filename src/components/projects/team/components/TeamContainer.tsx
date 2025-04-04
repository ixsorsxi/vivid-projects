
import React from 'react';

interface TeamContainerProps {
  children: React.ReactNode;
}

const TeamContainer: React.FC<TeamContainerProps> = ({ children }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium tracking-tight">Project Team</h2>
      </div>
      {children}
    </div>
  );
};

export default TeamContainer;
