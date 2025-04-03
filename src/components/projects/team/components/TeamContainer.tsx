
import React from 'react';

interface TeamContainerProps {
  children: React.ReactNode;
}

/**
 * Container component for the team display
 */
const TeamContainer: React.FC<TeamContainerProps> = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  );
};

export default TeamContainer;
