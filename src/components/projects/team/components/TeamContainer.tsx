
import React from 'react';
import { TeamMember } from '../types';

interface TeamContainerProps {
  children: React.ReactNode;
}

/**
 * Container component for the team display
 */
const TeamContainer: React.FC<TeamContainerProps> = ({ children }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      {children}
    </div>
  );
};

export default TeamContainer;
